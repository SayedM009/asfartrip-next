async function page({ searchParams }) {
    console.log(await searchParams)
    return <div>
        results
    </div>
}

export default page
