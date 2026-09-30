// Error texts live apart from the rest of the dictionary: error screens are client components
// that load with every page, and importing the full dictionary would ship all of it to browsers.
export const enError = {
  title: "Something went wrong",
  text: "This page could not be shown. Please try again, or contact us if it keeps happening.",
  retry: "Try again",
  home: "Home",
  contact: "Contact",
  section: "This section could not be loaded.",
};
