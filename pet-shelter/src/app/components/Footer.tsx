import Link from "next/link";

const Footer = () => {
    return (
        <footer className="flex flex-col items-center justify-center py-8 bg-gray-800 text-gray-100 sticky bottom-0">
            <div className="flex flex-col space-y-4">
                <h1 className="text-xl text-center font-bold">Знайдіть свого компаньйона</h1>
                <p className="text-center text-gray-400">Відвідайте наш притулок або знайдіть друга на сайті</p>
            </div>
            <div className="flex mt-6 space-x-4">
                <Link href="/" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-center text-white rounded-md">На головну</Link>
                <Link href="/pets" className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-center text-white rounded-md">Знайти улюбленця</Link>
            </div>
            <p className="text-center mt-6 text-sm">© 2024. Всі права захищені.</p>
        </footer>

    );
}

export default Footer; 