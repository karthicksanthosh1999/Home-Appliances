import { FC } from 'react';
import { useTheme } from '../../Context/ThemeContext';

const Settings: FC = () => {

    const { theme, toggleTheme } = useTheme();

    return (
        <section>
            <div className='dark:bg-gray-900 text-white bg-white dark:text-black overflow-hidden shadow rounded-lg border mt-5'>
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                        Settings
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        You can modifi you application theme.
                    </p>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                    <dl className="sm:divide-y sm:divide-gray-200">
                        <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500 dark:text-white">
                                Theme
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <label className="inline-flex items-center me-5 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        onClick={toggleTheme}
                                        checked={theme === "dark"}
                                    />
                                    <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-500"></div>
                                    <span className="ms-3 text-sm font-medium text-gray-300">{theme}</span>
                                </label>
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </section>
    )
}

export default Settings
