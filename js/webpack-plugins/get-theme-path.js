module.exports = () => {
    const path = require('path');
    const isGrootDev = 'LANDO_APP_NAME' in process.env
        && process.env.LANDO_APP_NAME === 'groot';

    // If we're developing Groot itself, and not a project based on it,
    // the current path resolves to `app` inside Lando, but we want the theme
    // dir, `groot`, instead.
    // If we're working on a client project, grab the normalized cwd basename
    // instead (i.e. the theme's root directory).
    const themeDirectory = isGrootDev ? 'groot' : path.basename(path.resolve());

    return `/wp-content/themes/${themeDirectory}/`;
}
