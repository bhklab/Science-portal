# Science Portal

The Science Portal is an open source institution publication management platform. The primary goal of the platform is to track, recognize, and reward outputs found research papers at an institution. "Outputs" can come in many different shapes and sizes such as data, code, containerized environments, results, clinical trials, protocols, cell lines, and plasmids. The variety of tracked outputs means there is a broad range of coverage across many different domains within cancer research. To learn more about the platform checkout the [documentation](https://pmscience.ca/about) page on the inaugural Princess Margaret Cancer Research Tower deployment.

## Platform Breakdown

### Core Web Application

The main web application is made up of two components, a React/TypeScript front-end and a NestJS/TypeScript backend which are all contained directly in this repository. Both of these components should utilize node version 22+ as the packages have been versioned for this use case.

#### Setup Web Application

```bash 
git clone https://github.com/bhklab/Science-portal.git
```

```bash
cd Science-portal
```

##### Verify node v22+
```bash
node -v
```

##### Install back-end API dependencies

```bash
npm install
```

##### Setup back-end environmnet variables

```bash
sudo vi .env
```

```bash
MONGODB_URL=mongodb+srv://... # Your mongo database

PORT=2000

DOMAIN=http://localhost:3000 # Will change to your deployment url once ready, for now this can just point to the local front-end deployment

SCRAPING_API=http://127.0.0.1:8000 # Not necessary, but can be utilized for intra app data output scraping

KEYCLOAK_USAGE=false # False by default, can be toggled on if usage of an internal KeyCloak instance is necessary
KEYCLOAK_AUTH_SERVER_URL=
KEYCLOAK_PWD_SIGN_ON=
KEYCLOAK_REALM=
KEYCLOAK_CLIENT_ID=
KEYCLOAK_CLIENT_SECRET=

JWT_SECRET= # Self generated JWT secret

YEAR_BOTTOM_LINE=2018 # Furthest year back the platform should report statistics

GOOGLE_APPLICATION_CREDENTIALS=path/to/publication-bucket-key # Bucket for storing publication pdfs (optional)
```

```bash
npm start
```

##### Install front-end dependencies

```bash
cd client
```

```bash
npm install
```

```bash
sudo vi .env
```

```bash
REACT_APP_INSTITUTE="Princess Margaret Cancer Centre" # Primary institution name
REACT_APP_SECONDARY_INSTITUTE="UHN" # Secondary institution name
```

```bash
npm start
```

### Addition Deployment Details

To ensure the entire platform contains all functionalities out of the box, it is also recommended (but not necessary) to deploy the [output scraping API](https://github.com/bhklab/science-portal-mailing). This provides additional capabilities to the platform that allow users to scrape details about publications not currently existing in the platform.

### Questions/Concerns

If you have any questions or concerns with the application or any of the deployment process feel free to reach out to us at support@pmscience.ca.