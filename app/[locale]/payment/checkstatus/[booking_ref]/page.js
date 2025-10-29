"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useRouter } from "@/i18n/navigation";
import { checkStatus } from "@/app/_libs/paymentService";
import {
    confirmFlightBooking,
    issueFlightBooking,
} from "@/app/_libs/flightService";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import useBookingStore from "@/app/_store/bookingStore";

/** =========================
 *  GPU Aurora Background (WebGL shader)
 *  ========================= */
// function AuroraBackground() {
//     const canvasRef = useRef(null);
//     const rafRef = useRef(0);

//     useEffect(() => {
//         const canvas = canvasRef.current;
//         if (!canvas) return;
//         const gl = canvas.getContext("webgl", {
//             alpha: true,
//             antialias: true,
//             powerPreference: "high-performance",
//         });
//         if (!gl) return;

//         // Resize
//         const resize = () => {
//             const dpr = Math.min(window.devicePixelRatio || 1, 2);
//             canvas.width = Math.floor(window.innerWidth * dpr);
//             canvas.height = Math.floor(window.innerHeight * dpr);
//             canvas.style.width = "100%";
//             canvas.style.height = "100%";
//             gl.viewport(0, 0, canvas.width, canvas.height);
//         };
//         resize();
//         window.addEventListener("resize", resize);

//         // Shaders (simple aurora-ish)
//         const vert = `
//       attribute vec2 a;
//       void main(){
//         gl_Position = vec4(a,0.0,1.0);
//       }
//     `;
//         const frag = `
//       precision highp float;
//       uniform vec2 r; // resolution
//       uniform float t; // time
//       // simple layered waves to mimic aurora
//       float wave(vec2 p, float spd, float scale, float phase) {
//         return sin(p.y*scale + t*spd + phase)*0.5+0.5;
//       }
//       void main(){
//         vec2 uv = gl_FragCoord.xy / r.xy;
//         uv.x *= r.x/r.y;

//         float a1 = wave(uv*2.0,  0.7, 6.0, 0.0);
//         float a2 = wave(uv*2.3,  0.9, 9.0, 1.2);
//         float a3 = wave(uv*1.7, -0.6, 5.0, 2.4);

//         float glow = pow(a1*0.6 + a2*0.3 + a3*0.4, 1.6);

//         vec3 deep = vec3(0.02, 0.08, 0.18);     // deep navy
//         vec3 accent1 = vec3(0.91, 0.42, 0.12);  // brand-ish orange
//         vec3 accent2 = vec3(0.20, 0.75, 0.65);  // teal
//         vec3 col = mix(deep, mix(accent1, accent2, a2), glow);

//         // subtle vignette
//         float d = distance(uv, vec2(0.5,0.5));
//         col *= smoothstep(0.95, 0.35, d);

//         gl_FragColor = vec4(col, 0.95);
//       }
//     `;

//         const C = gl.createProgram();
//         const vs = gl.createShader(gl.VERTEX_SHADER);
//         const fs = gl.createShader(gl.FRAGMENT_SHADER);
//         gl.shaderSource(vs, vert);
//         gl.shaderSource(fs, frag);
//         gl.compileShader(vs);
//         gl.compileShader(fs);
//         gl.attachShader(C, vs);
//         gl.attachShader(C, fs);
//         gl.linkProgram(C);
//         gl.useProgram(C);

//         const buf = gl.createBuffer();
//         gl.bindBuffer(gl.ARRAY_BUFFER, buf);
//         gl.bufferData(
//             gl.ARRAY_BUFFER,
//             new Float32Array([-1, -1, 3, -1, -1, 3]),
//             gl.STATIC_DRAW
//         );
//         const loc = gl.getAttribLocation(C, "a");
//         gl.enableVertexAttribArray(loc);
//         gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

//         const uRes = gl.getUniformLocation(C, "r");
//         const uTime = gl.getUniformLocation(C, "t");

//         let start = performance.now();
//         const draw = () => {
//             const now = performance.now();
//             const time = (now - start) / 1000;
//             gl.uniform2f(uRes, canvas.width, canvas.height);
//             gl.uniform1f(uTime, time);
//             gl.drawArrays(gl.TRIANGLES, 0, 3);
//             rafRef.current = requestAnimationFrame(draw);
//         };
//         draw();

//         return () => {
//             cancelAnimationFrame(rafRef.current);
//             window.removeEventListener("resize", resize);
//             gl.getExtension; // noop to satisfy linter
//         };
//     }, []);

//     return (
//         <canvas
//             ref={canvasRef}
//             className="absolute inset-0 w-full h-full"
//             aria-hidden
//         />
//     );
// }

/** =========================
 *  AI Orb (status-reactive)
 *  ========================= */
function AIOrb({ status }) {
    const palette = useMemo(() => {
        if (status === "success")
            return "from-emerald-400 via-cyan-300 to-sky-400";
        if (status === "error")
            return "from-rose-500 via-orange-400 to-amber-300";
        return "from-[#e86b1e] via-amber-300 to-white";
    }, [status]);

    console.log(status);

    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0.7 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            className="relative mx-auto"
        >
            {/* glow blur */}
            <div className="absolute -inset-10 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.12),transparent_60%)] blur-3xl" />
            {/* orb */}
            <div
                className={`w-28 h-28 rounded-full bg-gradient-to-br ${palette} shadow-2xl backdrop-blur-0`}
            />
            {/* pulse */}
            <motion.div
                className="absolute inset-0 rounded-full border border-white/20"
                animate={{ scale: [1, 1.12, 1], opacity: [0.7, 0.2, 0.7] }}
                transition={{
                    duration: 2.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
        </motion.div>
    );
}

/** =========================
 *  Main Page
 *  ========================= */
export default function PaymentCallback({ params }) {
    const { booking_ref } = params;
    const router = useRouter();

    const [status, setStatus] = useState("loading"); // loading | success | error

    const {
        gateway: { ifrurl },
        searchURL,
        sameBookingURL,
    } = useBookingStore();

    const [statusMessage, setStatusMessage] = useState(
        "Verifying your payment…"
    );
    const [retryCount, setRetryCount] = useState(0);
    const MAX_RETRIES = 2;

    const checkPaymentStatus = useCallback(async () => {
        if (!booking_ref) {
            setStatus("error");
            setStatusMessage("Missing booking reference.");
            return;
        }
        try {
            setStatus("loading");
            setStatusMessage("Checking payment status…");

            const res = await checkStatus(booking_ref);

            const success =
                res?.status?.toLowerCase() === "success" &&
                res?.gateway_response?.status?.toLowerCase() === "completed";

            const failed =
                res?.order_status?.toLowerCase() === "failure" ||
                ["failed", "cancelled", "declined"].includes(
                    (res?.gateway_response?.status || "").toLowerCase()
                );

            // const failed = true;

            if (success) {
                setStatusMessage("Payment successful. Confirming the booking…");
                const confirmRes = await confirmFlightBooking(res.booking_ref);
                const bookingStatus = confirmRes?.booking_status?.toUpperCase();

                console.log(res.gateway_response.id);

                if (bookingStatus === "CONFIRMED") {
                    try {
                        const issueRes = await issueFlightBooking(
                            confirmRes.booking_reference,
                            res.gateway_response.id,
                            "Payment Gateway"
                        );
                        if (issueRes?.alreadyIssued) {
                            setStatus("success");
                            setStatusMessage(
                                "Your ticket is already issued. Redirecting…"
                            );
                        } else {
                            setStatus("success");
                            setStatusMessage("Booking confirmed. Redirecting…");
                        }
                        setTimeout(() => {
                            router.push(
                                `/flights/status/success?order_id=${res.order_id}&booking_ref=${res.booking_ref}&module=flight&PNR=${confirmRes.PNR}`
                            );
                        }, 1500);
                    } catch (err) {
                        // Pending issuance → still a success view
                        setStatus("success");
                        setStatusMessage(
                            "Booking confirmed. Ticket issuance pending…"
                        );
                        setTimeout(() => {
                            router.push(
                                `/flights/status/success?order_id=${res.order_id}&booking_ref=${res.booking_ref}&pending=true&module=flight`
                            );
                        }, 2000);
                    }
                    return;
                }

                // Pending/Processing → treat as success view with pending note
                if (["PENDING", "PROCESSING"].includes(bookingStatus)) {
                    setStatus("success");
                    setStatusMessage(
                        "Payment received. Ticket issuance pending…"
                    );
                    setTimeout(() => {
                        router.push(
                            `/flights/status/success?order_id=${res.order_id}&booking_ref=${res.booking_ref}&pending=true&module=flight`
                        );
                    }, 2000);
                    return;
                }

                // Confirm failed
                setStatus("error");
                setStatusMessage("Booking confirmation failed. Redirecting…");
                setTimeout(() => {
                    router.push(
                        `/flights/status/rejected?order_id=${res.order_id}&booking_ref=${res.booking_ref}&module=flight`
                    );
                }, 2000);
                return;
            }

            if (failed) {
                setStatus("error");
                setStatusMessage("Payment failed or cancelled.");
                return;
            }

            // Ambiguous → retry
            if (retryCount < MAX_RETRIES) {
                setStatusMessage(
                    `Rechecking payment status... (Retry ${retryCount + 1})`
                );
                setTimeout(
                    () => setRetryCount((n) => n + 1),
                    1600 + retryCount * 600
                );
                return;
            }

            // No resolution
            setStatus("error");
            setStatusMessage("Unable to determine payment status.");
        } catch (err) {
            if (retryCount < MAX_RETRIES) {
                setStatusMessage(
                    `Network issue. Retrying (${
                        retryCount + 1
                    }/${MAX_RETRIES})…`
                );
                setTimeout(() => setRetryCount((n) => n + 1), 1800);
                return;
            }
            setStatus("error");
            setStatusMessage("Network error. Please try again.");
        }
    }, [booking_ref, retryCount, router]);

    useEffect(() => {
        checkPaymentStatus();
    }, [checkPaymentStatus]);

    return (
        <div className="relative  overflow-hidden ">
            {/* GPU aurora */}
            {/* <AuroraBackground /> */}

            {/* top branding bar (optional) */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24" />

            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-2">
                {/* Glass card */}
                <motion.div
                    initial={{ y: 24, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-xl rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 dark:border-white/20 px-6 py-8 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.20)] dark:shadow-[0_10px_50px_rgba(250,250,250, 0.90)]"
                >
                    <div className="flex flex-col sm:items-center gap-6">
                        <AIOrb status={status} />

                        <AnimatePresence mode="wait">
                            {status === "loading" && (
                                <motion.div
                                    key="loading"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.45 }}
                                    className="text-center"
                                >
                                    <div className="flex items-start justify-center gap-1 sm:gap-2 ">
                                        <Loader2 className="size-5 animate-spin" />
                                        <span className="tracking-wide text-sm">
                                            {statusMessage}
                                        </span>
                                    </div>
                                    <p className="mt-2  text-xs">
                                        Our AI agent is coordinating with the
                                        payment gateway and airline systems.
                                    </p>
                                </motion.div>
                            )}

                            {status === "success" && (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.45 }}
                                    className="text-center"
                                >
                                    <div className="flex items-center justify-center gap-1 sm:gap-2 text-emerald-300">
                                        <CheckCircle2 className="w-6 h-6" />
                                        <span className="tracking-wide font-medium">
                                            {statusMessage}
                                        </span>
                                    </div>
                                    <p className="mt-2  text-sm">
                                        Finalizing your itinerary and preparing
                                        e-ticket details…
                                    </p>
                                </motion.div>
                            )}

                            {status === "error" && (
                                <motion.div
                                    key="error"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.45 }}
                                    className="text-center"
                                >
                                    <div className="flex items-start justify-center gap-1 sm:gap-2 text-rose-500">
                                        <XCircle className="w-6 h-6" />
                                        <span className="tracking-wide font-medium">
                                            {statusMessage}
                                        </span>
                                    </div>

                                    <div className="flex flex-col gap-3 w-full max-w-xs mx-auto mt-5">
                                        <button
                                            onClick={() =>
                                                (window.location.href = ifrurl)
                                            }
                                            className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600   text-white font-medium text-sm cursor-pointer transition-all duration-200 hover:brightness-110 hover:scale-[1.02] hover:shadow-lg  active:scale-[0.98]"
                                        >
                                            Retry
                                        </button>

                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                onClick={() =>
                                                    router.push(sameBookingURL)
                                                }
                                                className="w-full py-3 rounded-lg bg-gradient-to-r from-[#e86b1e] to-amber-300 text-white font-semibold text-sm cursor-pointertransition-all duration-200hover:brightness-110 hover:scale-[1.02] hover:shadow-lgactive:scale-[0.98]"
                                            >
                                                Same Booking
                                            </button>

                                            <button
                                                onClick={() =>
                                                    router.push(searchURL)
                                                }
                                                className="w-full py-3 rounded-lg bg-gradient-to-r from-green-400 to-green-600 text-white font-medium text-sm cursor-pointer transition-all duration-200 hover:brightness-110 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
                                            >
                                                New Search
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* status timeline */}
                        <div className="mt-3 w-full">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[12px] ">
                                <div
                                    className={`rounded-lg px-3 py-2 border ${
                                        status === "error"
                                            ? "border-rose-500 bg-rose-500/10 "
                                            : ["loading", "success"].includes(
                                                  status
                                              )
                                            ? "border-black/30 bg-white/5 dark:border-white/30"
                                            : "border-black/10 dark:border-white/20"
                                    }`}
                                >
                                    1. Payment Verified
                                </div>

                                <div
                                    className={`rounded-lg px-3 py-2 border ${
                                        status === "success"
                                            ? "border-black/30 bg-white/5 dark:border-white/30"
                                            : "border-black/10 dark:border-white/20"
                                    }`}
                                >
                                    2. Booking Confirmed
                                </div>

                                <div
                                    className={`rounded-lg px-3 py-2 border ${
                                        status === "success"
                                            ? "border-black/30 bg-white/5 dark:border-white/30"
                                            : "border-black/10 dark:border-white/20"
                                    }`}
                                >
                                    3. Ticket Issuance
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* subtle footer */}
                <div className="mt-6 text-xs ">
                    Powered by AI · Real-time orchestration · Secure gateway
                </div>
            </div>
        </div>
    );
}
