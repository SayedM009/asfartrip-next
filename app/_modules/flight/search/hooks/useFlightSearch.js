"use client";

import { useState } from "react";
import { validateSearchParams } from "../logic/validateSearchParams";
import { buildSearchObject } from "../logic/buildSearchObject";

export function useFlightSearch() {
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleSearchWithRedirect({ router, ...form }) {
    setErrors([]);

    const validation = validateSearchParams({
      departure: form.departure,
      destination: form.destination,
      tripType: form.tripType,
      departDate: form.departDate,
      range: form.range,
      ADT: form.passengers.adults,
      CHD: form.passengers.children,
      INF: form.passengers.infants,
    });

    if (!validation.valid) {
      setErrors(validation.errors);
      return { ok: false, errors: validation.errors };
    }

    setLoading(true);

    try {
      const formatDate = form.formatDateFn;

      const departDateStr = formatDate(form.departDate);
      const returnFromStr = form.range?.from
        ? formatDate(form.range.from)
        : null;
      const returnToStr = form.range?.to ? formatDate(form.range.to) : null;

      const searchObject = buildSearchObject({
        departure: form.departure,
        destination: form.destination,
        tripType: form.tripType,
        departDateStr,
        returnFromStr,
        returnToStr,
        passengers: form.passengers,
        travelClass: form.travelClass,
      });

      const params = new URLSearchParams();
      params.set("searchObject", JSON.stringify(searchObject));
      params.set(
        "cities",
        JSON.stringify({
          departure: form.departure,
          destination: form.destination,
        })
      );

      router.push(`/flights/search?${params.toString()}`);

      return { ok: true };
    } catch (error) {
      console.error("[useFlightSearch] Error:", error);
      setErrors([error.message]);
      return { ok: false, errors: [error.message] };
    } finally {
      setLoading(false);
    }
  }

  return {
    handleSearchWithRedirect,
    errors,
    loading,
  };
}
