import {getRequestConfig} from 'next-intl/server';
import {cookies} from "next/headers";

export default getRequestConfig(async () => {
    const locale = cookies().get("locale")?.value || "uk";

    return {
        locale,
        messages: (await import(`../../messages/${locale}.json`)).default
    };
});