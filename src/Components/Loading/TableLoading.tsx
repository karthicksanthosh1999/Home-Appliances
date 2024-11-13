import { FC } from 'react'

const TableLoading:FC = () => {
    return (
        <>
            <tr className='flex items-center justify-center'>
                <td colSpan={6} className='py-16'>
                    <div className="rounded-md h-12 w-12 border-4 border-t-4 border-blue-500 animate-spin absolute"></div>
                </td>
            </tr>
        </>
    )
}

export default TableLoading
