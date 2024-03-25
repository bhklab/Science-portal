import {matchRoutes, useLocation} from "react-router-dom";

const routes = [
    { path: "/" },
    // { path: "/pipeline/:id" },
    // { path: "/pipeline/:id/expanded" },
    // { path: "/tool/:id" },
    // { path: "/explore" },
    // { path: "/build" },
    // { path: "/learn" },
    // { path: "/profile" },
]


export const useCurrentPath = () => {
    const location = useLocation()
    const matches = matchRoutes(routes, location)
    // @ts-ignore
    for (const match of matches) {
        if (match.pathname === location.pathname) {
            return match.route.path
        }
    }

    // If there is no exact match, return the path of the first route
    return matches![0].route.path
}
