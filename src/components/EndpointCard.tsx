export interface EndpointResult {
    loading: boolean,
    status?: number,
    data?: any,
    error?: string,
    errorKind?: 'validation'
}

export interface EndpointCardProps {
    title: string
    method: 'GET' | 'POST'
    path: string
    pathVariable?: {  // ? means property may/may not exist
        prefix: string
        value: string
        onChange: (value: string) => void
        label: string
    }
    requestBody?: {
        id: string
        label: string
        value: string
        onChange: (value: string) => void
    }
    access: string
    result?: EndpointResult
    onRun: () => void
}

export default function EndpointCard({
    title, method, path, pathVariable, requestBody, access, result, onRun,
}: EndpointCardProps) {

    return (
        <div className="endpoint-card">
            <div className="endpoint-card-header">
                {/** method badge and path */}
                <div>
                    <h3 className="endpoint-title">{title}</h3>
                    <div className="method-path-row">
                        <span>
                            {method}
                        </span>
                        {pathVariable ? (
                            <span className="endpoint-path-control">
                                <code>{pathVariable.prefix}</code>
                                <input
                                    aria-label={pathVariable.label}
                                    className="endpoint-path-input"
                                    onChange={(event) => pathVariable.onChange(event.target.value)}
                                    value={pathVariable.value}
                                />
                            </span>
                        ) : (
                            <code>{path}</code>
                        )}
                    </div>
                </div>
                {/** access tag and run button */}
                <div className="endpoint-card-actions">
                    {access === 'ADMIN' && (
                        <span>
                            {access}
                        </span>
                    )}
                    <button
                        onClick={onRun}
                        disabled={result?.loading || pathVariable?.value.trim() === ''}
                    >
                        {result?.loading ? 'Testing...' : 'Run Test'}
                    </button>
                </div>
            </div>

            {requestBody && (
                <div className="request-body-editor">
                    <label htmlFor={requestBody.id}>{requestBody.label}</label>
                    <textarea
                        id={requestBody.id}
                        onChange={(event) => requestBody.onChange(event.target.value)}
                        spellCheck={false}
                        value={requestBody.value}
                    />
                </div>
            )}

            {/** response terminal box */}
            {result && (<div className="response-body">
                <div>
                    <span>{result.errorKind === 'validation' ? 'Invalid JSON' : `Status: ${result.status ?? 'Network Error'}`}</span>
                </div>
                <pre>
                    {result.error
                        ? `Error: ${result.error}`
                        : JSON.stringify(result.data, null, 2)}
                </pre>
            </div>)}
        </div>
    )
}