import React from 'react';
import DataTableLib from 'react-data-table-component';
import { StyleSheetManager } from 'styled-components';
import isPropValid from '@emotion/is-prop-valid';
const DataTable = DataTableLib.default || DataTableLib;

const customStyles = {
    table: {
        style: {
            backgroundColor: 'transparent',
        },
    },
    headRow: {
        style: {
            backgroundColor: '#f8fafc',
            borderBottomWidth: '1px',
            borderBottomColor: '#e2e8f0',
            minHeight: '36px',
        },
    },
    headCells: {
        style: {
            fontSize: '11px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: '#64748b',
            paddingLeft: '12px',
            paddingRight: '12px',
            paddingTop: '0px',
            paddingBottom: '0px',
        },
    },
    cells: {
        style: {
            paddingLeft: '12px',
            paddingRight: '12px',
            paddingTop: '8px',
            paddingBottom: '8px',
            fontSize: '13px',
        },
    },
    rows: {
        style: {
            backgroundColor: '#ffffff',
            minHeight: '40px',
                '&:not(:last-of-type)': {
                    borderBottomStyle: 'solid',
                    borderBottomWidth: '1px',
                    borderBottomColor: '#f1f5f9',
                },
            '&:hover': {
                backgroundColor: '#f8fafc',
                transition: 'background-color 0.2s',
            },
            fontSize: '13px',
        },
    },
    pagination: {
        style: {
            borderTopWidth: '1px',
            borderTopColor: '#e2e8f0',
            backgroundColor: '#f8fafc',
            padding: '8px 12px',
            fontSize: '13px',
        },
    },
};

export default function CustomDataTable({ columns, data, loading = false, ...props }) {
    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200">
            <DataTable
                columns={columns}
                data={data}
                customStyles={customStyles}
                progressPending={loading}
                pagination
                paginationPerPage={10}
                paginationRowsPerPageOptions={[5, 10, 15, 20,50]}
                highlightOnHover
                pointerOnHover
                noDataComponent={
                    <div className="py-8 text-center">
                        <p className="text-slate-400 text-sm">Không có dữ liệu</p>
                    </div>
                }
                {...props}
            />
        </div>
    );
}