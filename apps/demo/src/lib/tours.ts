import type { BuddyTour } from "@onboardbuddy/react";

export const sellerTour: BuddyTour = {
  id: "seller-dashboard",
  autoStart: true,
  completion: {
    strategy: "localStorage",
    key: "onboardbuddy:seller-dashboard:v1"
  },
  steps: [
    {
      id: "overview",
      target: "[data-tour-id='overview']",
      title: "Start with your store overview",
      body: "Track revenue, conversion, and active listings from the dashboard summary.",
      character: {
        type: "image",
        imageUrl: "/characters/split-character.svg",
        alt: "OnboardBuddy seller guide",
        width: 220,
        height: 220,
        hand: {
          imageUrl: "/characters/split-hand.svg",
          alt: "Pointing hand",
          width: 132,
          height: 76,
          position: { x: "58%", y: "47%" },
          shoulderPivot: { x: "12%", y: "58%" },
          pointerAnchor: { x: "95%", y: "18%" },
          rotation: -10,
          shake: { degrees: 5, durationMs: 850 }
        }
      },
      pointerAnchor: { x: "86%", y: "42%" },
      targetAnchor: "left-center",
      offset: { x: -8, y: -8 },
      overlay: "spotlight",
      animation: "wiggle",
      interaction: "blocked",
      controls: { back: false, next: true, skip: true, stepCount: true }
    },
    {
      id: "products",
      target: "[data-tour-id='products-table']",
      title: "Manage marketplace listings",
      body: "Review product status, inventory, pricing, and publishing state in one place.",
      character: { type: "builtin" },
      pointerAnchor: { x: "84%", y: "44%" },
      targetAnchor: "top-left",
      offset: { x: 20, y: -20 },
      overlay: "dim",
      animation: "bounce",
      interaction: "target",
      controls: { back: true, next: true, skip: true, stepCount: true }
    },
    {
      id: "add-product",
      target: "[data-tour-id='add-product']",
      title: "Add new products quickly",
      body: "Use this button when you want to publish a new marketplace product.",
      character: { type: "builtin" },
      pointerAnchor: { x: "88%", y: "39%" },
      targetAnchor: "left-center",
      offset: { x: -12, y: -28 },
      overlay: "spotlight",
      animation: "pulse",
      interaction: "blocked",
      controls: { back: true, next: true, skip: true, stepCount: true }
    },
    {
      id: "orders",
      target: "[data-tour-id='orders']",
      title: "Keep orders moving",
      body: "Follow new orders, fulfillment status, and customer issues from this panel.",
      character: { type: "builtin" },
      pointerAnchor: { x: "16%", y: "42%" },
      targetAnchor: "right-center",
      offset: { x: 10, y: -4 },
      overlay: "blur",
      animation: "wiggle",
      interaction: "blocked",
      controls: { back: true, next: true, skip: true, stepCount: true }
    },
    {
      id: "settings",
      target: "[data-tour-id='settings']",
      title: "Finish with store settings",
      body: "Update payout, shipping, profile, and store preferences whenever needed.",
      character: { type: "builtin" },
      pointerAnchor: { x: "82%", y: "36%" },
      targetAnchor: "left-center",
      offset: { x: -6, y: -18 },
      overlay: "spotlight",
      animation: "bounce",
      interaction: "blocked",
      controls: { back: true, finish: true, skip: false, stepCount: true }
    }
  ]
};

export const defaultTours = [sellerTour];
