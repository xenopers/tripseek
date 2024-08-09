/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as AboutImport } from './routes/about'
import { Route as IndexImport } from './routes/index'
import { Route as TripsIndexImport } from './routes/trips/index'
import { Route as TripsTripIdImport } from './routes/trips/$tripId'

// Create/Update Routes

const AboutRoute = AboutImport.update({
  path: '/about',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const TripsIndexRoute = TripsIndexImport.update({
  path: '/trips/',
  getParentRoute: () => rootRoute,
} as any)

const TripsTripIdRoute = TripsTripIdImport.update({
  path: '/trips/$tripId',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/about': {
      id: '/about'
      path: '/about'
      fullPath: '/about'
      preLoaderRoute: typeof AboutImport
      parentRoute: typeof rootRoute
    }
    '/trips/$tripId': {
      id: '/trips/$tripId'
      path: '/trips/$tripId'
      fullPath: '/trips/$tripId'
      preLoaderRoute: typeof TripsTripIdImport
      parentRoute: typeof rootRoute
    }
    '/trips/': {
      id: '/trips/'
      path: '/trips'
      fullPath: '/trips'
      preLoaderRoute: typeof TripsIndexImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren({
  IndexRoute,
  AboutRoute,
  TripsTripIdRoute,
  TripsIndexRoute,
})

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/about",
        "/trips/$tripId",
        "/trips/"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/about": {
      "filePath": "about.tsx"
    },
    "/trips/$tripId": {
      "filePath": "trips/$tripId.tsx"
    },
    "/trips/": {
      "filePath": "trips/index.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
