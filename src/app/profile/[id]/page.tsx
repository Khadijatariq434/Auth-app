export default async function UserProfile({params}:any) {
    const {id} = await params
    return(
        <div className="flex flex-col justify-center items-center text-2xl">
            <h1>Profile</h1>
            <p className="text-amber-300">This is profile {id} </p>
        </div>
    )
}