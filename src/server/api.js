export const BASE_URL = (process.env.REACT_APP_SERVER_MODE === 'development' ? process.env.REACT_APP_DEV_URL || 'http://localhost:3030/' : process.env.REACT_APP_PROD_URL) || 'http://localhost:3030/'
