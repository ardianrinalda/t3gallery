export const runtime = 'nodejs';
import { PostHog } from 'posthog-node';

function serverSideAnalytics() {
    const posthogClient = new PostHog(
        'phc_Q1jhFjtYZ4nmMEVGyXJt0jJPa5pqfjWGaRwc13oAA7Z',
        { host: 'https://us.i.posthog.com' }
    );

    return posthogClient
} 

const analyticsServerClient = serverSideAnalytics();

export default analyticsServerClient;