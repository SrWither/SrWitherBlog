export default defineNitroPlugin((nitroApp) => {
    console.log('[Nitro] Logger Plugin Loaded');
    nitroApp.hooks.hook('error', (error) => {
      console.error(`[Nitro Error] ${error.message}`, error.stack);
    });
  });
  