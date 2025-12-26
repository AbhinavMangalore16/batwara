import { authClient } from "@/lib/auth-client"
import AuthView from "@/modules/auth/views/AuthView"
import { de } from "date-fns/locale"

const Page = async () =>{
    return <AuthView />
}

export default Page;