import { useState } from "react"
import apiClient from "../apiClient"
import { useAuth } from "../AuthContext"
import { EndpointResult } from "./EndpointCard"
import EndpointCard from "./EndpointCard"

export default function InteractiveAPITestDashboard() {
    const { authenticated, loading: authLoading } = useAuth()

    //map endpoints (e.g. 'getAllEvents') to their test results
    const [results, setResults] = useState<Record<string, EndpointResult>>({})
    const [eventId, setEventId] = useState('1')
    const [eventId2, setEventId2] = useState('1')
    const [eventBody, setEventBody] = useState(JSON.stringify({
        title: 'Test Event',
        venue: 'Main Hall',
        eventDate: '2026-12-31T19:00:00',
        price: 49.99,
        totalSeats: 100,
    }, null, 2))
    const [bookingBody, setBookingBody] = useState(JSON.stringify({
        event_id: 1,
        seatIds: [1],
    }, null, 2))
    const [confirmPaymentBody, setConfirmPaymentBody] = useState(JSON.stringify({
        event_id: 1,
        seatIds: [1],
    }, null, 2))

    //reusable test runner
    const runTest = async (key: string, requestFn: () => Promise<any>) => {
        setResults((prev) => ({
            ...prev,
            [key]: { loading: true }
        }))

        try {
            const response = await requestFn()
            setResults((prev) => ({
                ...prev,
                [key]: {
                    loading: false,
                    status: response.status,
                    data: response.data,
                },
            }))
        } catch (err: any) {
            setResults((prev) => ({
                ...prev,
                [key]: {
                    loading: false,
                    status: err.response?.status ?? 500,
                    error: err.response?.data?.message || err.message || 'Request failed',
                }
            }))
        }

    }

    const runJsonPost = (key: string, path: string, body: string) => {
        let payload: unknown
        try {
            payload = JSON.parse(body)
            if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) {
                throw new Error('Request body must be a JSON object.')
            }
        } catch {
            setResults((prev) => ({
                ...prev,
                [key]: {
                    loading: false,
                    errorKind: 'validation',
                    error: 'Enter a valid JSON object before running this request.',
                },
            }))
            return
        }

        void runTest(key, () => apiClient.post(path, payload))
    }

    const runCreateEvent = () => runJsonPost('createEvent', '/api/events', eventBody)
    const runCreateBooking = () => runJsonPost('createBooking', '/api/bookings', bookingBody)

    if (authLoading || !authenticated) return null

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6 bg-gray-50 min-h-screen rounded-xl">
            <div className="api-dashboard-intro">
                <h1 className="text-2xl font-bold text-gray-900">Interactive API Testing Dashboard</h1>
                <p className="api-dashboard-description">
                    Test Spring Boot backend endpoints live. Guarded routes return 403 if your Keycloak role lacks permissions.
                </p>
            </div>

            {/* Section 1 (Events) */}
            <section className="endpoint-section">
                <h2 className="endpoint-section-title">Event Endpoints</h2>

                {/* 1. Get All Events */}
                <EndpointCard
                    title="Get All Events"
                    method="GET"
                    path="/api/events"
                    access="Public / Authenticated"
                    result={results['getAllEvents']}
                    onRun={() =>
                        runTest('getAllEvents', () => apiClient.get('/api/events'))
                    }
                />

                {/* 2. Get Event By ID */}
                <EndpointCard
                    title="Get Event By ID"
                    method="GET"
                    path="/api/events/{id}"
                    pathVariable={{
                        prefix: '/api/events/',
                        value: eventId,
                        onChange: setEventId,
                        label: 'Event ID',
                    }}
                    access="Public / Authenticated"
                    result={results['getEventById']}
                    onRun={() =>
                        runTest('getEventById', () =>
                            apiClient.get(`/api/events/${encodeURIComponent(eventId.trim())}`)
                        )
                    }
                />

                {/* 3. Create Event (ADMIN Only) */}
                <EndpointCard
                    title="Create Event"
                    method="POST"
                    path="/api/events"
                    access="ADMIN"
                    result={results['createEvent']}
                    requestBody={{
                        id: 'create-event-body',
                        label: 'Create event JSON request body',
                        value: eventBody,
                        onChange: setEventBody,
                    }}
                    onRun={runCreateEvent}
                />
            </section>

            <section className="endpoint-section">
                <h2 className="endpoint-section-title">Seat Endpoints</h2>


                {/* 1. Get Seats by Event ID */}
                <EndpointCard
                   title="Get Seats By Event ID"
                   method="GET"
                   path="/api/seats/event/{id}"
                   pathVariable={
                    {
                        prefix: "api/seats/event/",
                        value: eventId2,
                        onChange: setEventId2,
                        label: "Event ID"
                    }
                   }
                   access="Public/Authenticated"
                   result={results["getSeatsByEventId"]}
                   onRun={() => runTest("getSeatsByEventId", () => apiClient.get(`/api/seats/event/${encodeURIComponent(eventId2.trim())}`))}
                />
            </section>


            <section className="endpoint-section">
                <h2 className="endpoint-section-title">Booking Endpoints</h2>

                <EndpointCard
                    title="Create Booking"
                    method="POST"
                    path="/api/bookings"
                    access="Authenticated"
                    result={results['createBooking']}
                    requestBody={{
                        id: 'create-booking-body',
                        label: 'Create booking JSON request body',
                        value: bookingBody,
                        onChange: setBookingBody,
                    }}
                    onRun={runCreateBooking}
                />

                <EndpointCard
                    title="Get All Bookings"
                    method="GET"
                    path="/api/bookings"
                    access="ADMIN"
                    result={results['getAllBookings']}
                    onRun={() =>
                        runTest('getAllBookings', () => apiClient.get('/api/bookings'))
                    }
                />

                <EndpointCard
                    title="Get My Bookings"
                    method="GET"
                    path="/api/bookings/my-bookings"
                    access="Authenticated"
                    result={results['getMyBookings']}
                    onRun={() =>
                        runTest('getMyBookings', () => apiClient.get('/api/bookings/my-bookings'))
                    }
                />

                <EndpointCard
                    title="Confirm Payment"
                    method="POST"
                    path="/api/bookings/confirm-payment"
                    access="Authenticated"
                    result={results['confirmPayment']}
                    requestBody={{
                        id: 'confirm-payment-body',
                        label: 'Confirm payment JSON request body',
                        value: confirmPaymentBody,
                        onChange: setConfirmPaymentBody,
                    }}
                    onRun={() =>
                        runJsonPost(
                            'confirmPayment',
                            '/api/bookings/confirm-payment',
                            confirmPaymentBody,
                        )
                    }
                />
            </section>
        </div>
    )
}


//what is Record in TS
// why setState(prev => {newState}) vs setState(newState)
// what does axios response object look like