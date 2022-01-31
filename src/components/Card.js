export default function Card({ children }) {
    return (
        <div className="w-full sm:w-2/3 lg:w-2/5 bg-white dark:bg-gray-800 mt-0 sm:mt-2 min-h-screen sm:min-h-0 shadow rounded-none sm:rounded-lg">
            {children}
        </div>
    )
}