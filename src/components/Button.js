export default function Button({ onClick, className, children }) {
    return (
        <button
        onClick={onClick}
        className={`${className ? className : ''} text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-100 px-6 py-4 font-bold text-3xl rounded-lg shadow-sm`}>
            {children}
        </button>
    )
}