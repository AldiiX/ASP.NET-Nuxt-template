import type {WebTheme} from "#shared/types";

export default function(theme: WebTheme) {
    // validace vstupu
    if(theme !== "light" && theme !== "dark") { throw new Error("spatny theme") }

    // globalni state (inic. z pluginu)
    const state = useState<WebTheme | null>("theme", () => null)
    state.value = theme

    // zzapsani cookies
    const cookie = useCookie<WebTheme | null>("theme", {
        path: "/",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365, // 1 rok
        //secure: process.env.NODE_ENV === "production"
    })

    cookie.value = theme;
}