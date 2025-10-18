import { component$ } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';

export const useMaintenanceRedirect = routeLoader$(({ redirect }) => {
  throw redirect(302, '/');
});

export default component$(() => {
  useMaintenanceRedirect();
  return null;
});
