function Login() {
    return (
        <>
            <div className="flex flex-col justify-center items-center rounded-2xl text-white bg-green-600 p-5 h-100 w-90">
                <div className="flex flex-col justify-center items-center h-full w-full">
                    <h1 className="text-2xl font-bold">Login</h1>
                    <form className="flex flex-col justify-center h-full w-full" action="">
                        <input type="text" placeholder="Email/Username" />
                        <input type="text" placeholder="Email/Password" />
                        <button className="rounded-2xl w-25 bg-white text-black">Login</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Login