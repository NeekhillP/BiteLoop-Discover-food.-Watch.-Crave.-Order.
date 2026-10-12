---
version: alpha
name: BiteLoop
description: Simple food discovery, store profiles, and authentication with system light and dark themes.
colors:
  primary: '#246448'
  background: '#f5f7f6'
  surface: '#ffffff'
  text: '#1b3028'
  muted: '#617068'
  border: '#d8e1dc'
typography:
  body:
    fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif"
  display:
    fontFamily: "'Trebuchet MS', 'Segoe UI', sans-serif"
rounded:
  DEFAULT: '10px'
  card: '24px'
spacing:
  content-gap: '24px'
  card-padding: '32px'
components:
  AuthPage:
    stylesheet: frontend/bite-loop/src/styles/auth.css
  FoodReel:
    stylesheet: frontend/bite-loop/src/styles/feed.css
  PartnerProfile:
    stylesheet: frontend/bite-loop/src/styles/profile.css
---

# BiteLoop design

## Overview
Product UI for food lovers and food businesses. The requested direction is minimal, with business identity and real food videos doing the visual work. English copy; no assumed market or currency. Avoid fabricated customer statistics, decorative stock images, and promotional dashboards.

## Colors
`frontend/bite-loop/src/styles/theme.css` owns runtime tokens. This document mirrors its accepted values. System dark mode remaps the same semantic variables. Profile and auth pages use theme surfaces; video overlays retain white text on a dark scrim in either theme.

## Typography
Display headings and the wordmark use Trebuchet MS with system fallbacks. Body text and controls use Segoe UI/system fonts. There are no external font requests. Business names and addresses wrap rather than clipping.

## Layout
Authentication remains a centered form. The feed is the only viewport-bound scrolling surface. Store profiles scroll naturally, with a 960px maximum width and a business header above three video columns. Narrow screens simplify the header, and the grid becomes two columns below 420px.

## Elevation & Depth
Flat surfaces and subtle borders; no glass or card shadows. Dark scrims belong only to video content where text needs contrast.

## Shapes
10px controls and video frames, 24px profile/auth cards, circular initial-based avatars. No avatar photo is invented when the model provides none.

## Components
Global scrollbars and focus styles belong to App.css. AuthPage owns authentication visuals. FoodReel owns snapping video cards. ProfileFoodCard uses native video controls, fixed portrait geometry, and pauses other videos when playback starts. Navigation uses links; retries use buttons.

Token mapping: primary to `--color-accent`, surfaces/text/border to corresponding `--color-*` variables, typography to `--font-body` and `--font-display`, DEFAULT/card radii to `--radius-control`/`--radius-card`, content gap/card padding to `--space-5`/`--space-6`. All page styles consume these runtime variables.

Store facts come from `backend/src/models/foodPartner.model.js`; food facts come from `foodItem.model.js`. `/api/food/partner/:partnerId` filters foods by owner and exposes only business name/address plus public food details. Either existing account type may view profiles. The meal total counts saved food items; customer counts are absent because there is no source for them. Loading, failed video, empty store, missing store, expired session, and request retry have explicit UI states.

## Do's and Don'ts
- Reuse shared tokens and preserve system theme behavior.
- Keep media geometry stable while loading and preserve natural page scrolling.
- Render business and food information from API responses.
- Do not expose partner passwords, email, or private contact fields in the profile response.
- Do not invent currency, customer counts, or images.
