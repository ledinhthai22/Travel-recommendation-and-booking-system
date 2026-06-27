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
            minHeight: '44px',
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
        },
    },
    cells: {
        style: {
            paddingLeft: '12px',
            paddingRight: '12px',
            paddingTop: '10px',
            paddingBottom: '10px',
            fontSize: '13px',
            whiteSpace: 'normal',          
            wordBreak: 'break-word',
        },
    },
    rows: {
        style: {
            backgroundColor: '#ffffff',
            minHeight: '52px',
            '&:not(:last-of-type)': {
                borderBottomStyle: 'solid',
                borderBottomWidth: '1px',
                borderBottomColor: '#f1f5f9',
            },
            '&:hover': {
                backgroundColor: '#f8fafc',
                transition: 'background-color 0.2s',
            },
        },
    },
    pagination: {
        style: {
            borderTopWidth: '1px',
            borderTopColor: '#e2e8f0',
            backgroundColor: '#f8fafc',
            padding: '12px 16px',
            fontSize: '13px',
        },
    },
    noData: {
        style: {
            padding: '60px 20px',
        },
    },
};

export default function CustomDataTable({ 
    columns, 
    data, 
    loading = false, 
    ...props 
}) {
    return (
        <StyleSheetManager shouldForwardProp={isPropValid}>
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200">
                <DataTable
                    columns={columns}
                    data={data}
                    customStyles={customStyles}
                    progressPending={loading}
                    pagination
                    paginationPerPage={10}
                    paginationRowsPerPageOptions={[5, 10, 15, 20, 50]}
                    highlightOnHover
                    pointerOnHover
                    responsive                 
                    dense={false}
                    noDataComponent={
                        <div className="py-16 text-center">
                            <p className="text-slate-400 text-sm font-medium">
                                Không có dữ liệu
                            </p>
                        </div>
                    }
                    {...props}
                />
            </div>
        </StyleSheetManager>
    );
}