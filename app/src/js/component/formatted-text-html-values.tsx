import * as React from 'react'

export const SimpleHTML = {
    b: (chunks: React.ReactNode) => <b key={Math.random()}>{chunks}</b>,
    i: (chunks: React.ReactNode) => <i key={Math.random()}>{chunks}</i>,
}
