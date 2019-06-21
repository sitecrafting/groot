#!/bin/bash

POSITIONAL=()
while [[ $# -gt 0 ]]
do
key="$1"

case $key in
    -n|--non-interactive)
    INTERACTIVE=NO
    shift # past argument
    ;;
    --timber-version)
    TIMBER_VERSION="$2"
    shift # past argument
    shift # past argument
    ;;
    *)    # unknown option
    POSITIONAL+=("$1") # save it in an array for later
    shift # past argument
    ;;
esac
done
set -- "${POSITIONAL[@]}" # restore positional parameters

if [[ $CI = true ]]
then
	# are we in a CI environment?
	echo 'forcing non-interactive mode for CI environment'
	INTERACTIVE='NO'
else
	# not in a CI environment, default to interactive mode
	INTERACTIVE=${INTERACTIVE:-'YES'}
fi

# Install and configure WordPress if we haven't already
main() {
  BOLD=$(tput bold)
  NORMAL=$(tput sgr0)

  WP_DIR="$LANDO_MOUNT/wp"

  if ! [[ -f "$WP_DIR"/wp-content/themes/groot ]]
  then
    echo 'Linking groot theme directory...'
    ln -s "../../../" "$WP_DIR"/wp-content/themes/groot
  fi

  echo 'Checking for WordPress config...'
  if wp_configured
  then
    echo 'WordPress is configured'
  else
    read -d '' extra_php <<'EOF'
// log all notices, warnings, etc.
error_reporting(E_ALL);

// enable debug logging
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);
EOF

    # create a wp-config.php
    wp config create \
      --dbname="wordpress" \
      --dbuser="wordpress" \
      --dbpass="wordpress" \
      --dbhost="database" \
      --extra-php < <(echo "$extra_php")
  fi

  echo 'Checking for WordPress installation...'
  if wp_installed
  then
    echo 'WordPress is installed'
  else
    if [[ $INTERACTIVE = 'YES' ]]
    then

      #
      # Normal/default interactive mode: prompt the user for WP settings
      #

      read -p "${BOLD}Site URL${NORMAL} (https://groot.lndo.site): " URL
      URL=${URL:-'https://groot.lndo.site'}

      read -p "${BOLD}Site Title${NORMAL} (Groot): " TITLE
      TITLE=${TITLE:-'Groot'}

      # Determine the default username/email to suggest based on git config
      DEFAULT_EMAIL=$(git config --global user.email)
      DEFAULT_EMAIL=${DEFAULT_EMAIL:-'admin@example.com'}
      DEFAULT_USERNAME=$(echo $DEFAULT_EMAIL | sed 's/@.*$//')

      read -p "${BOLD}Admin username${NORMAL} ($DEFAULT_USERNAME): " ADMIN_USER
      ADMIN_USER=${ADMIN_USER:-"$DEFAULT_USERNAME"}

      read -p "${BOLD}Admin password${NORMAL} (groot): " ADMIN_PASSWORD
      ADMIN_PASSWORD=${ADMIN_PASSWORD:-'groot'}

      read -p "${BOLD}Admin email${NORMAL} ($DEFAULT_EMAIL): " ADMIN_EMAIL
      ADMIN_EMAIL=${ADMIN_EMAIL:-"$DEFAULT_EMAIL"}

    fi

    # install WordPress
    wp core install \
      --url="$URL" \
      --title="$TITLE" \
      --admin_user="$ADMIN_USER" \
      --admin_password="$ADMIN_PASSWORD" \
      --admin_email="$ADMIN_EMAIL" \
      --skip-email
  fi

  # install/activate plugins and theme
  uninstall_plugins hello akismet
  # install and activate Timber in different steps
  wp plugin install timber-library
  wp plugin activate timber-library
  wp plugin activate conifer
  wp theme activate groot

  # install a specific version of Timber if necessary
  if [[ "$TIMBER_VERSION" ]]
  then
    composer require --dev timber/timber:"$TIMBER_VERSION"
  fi

  # uninstall stock themes
  wp theme uninstall twentyten twentyeleven twentytwelve \
    twentythirteen twentyfourteen twentyfifteen twentysixteen twentyseventeen

  # configure pretty permalinks
  wp option set permalink_structure '/%postname%/'
  wp rewrite flush

}


# Detect whether WP has been configured already
wp_configured() {
  [[ $(wp config path 2>/dev/null) ]] && return
  false
}

# Detect whether WP is installed
wp_installed() {
  wp core is-installed 2>/dev/null
  [[ "$?" = "0" ]] && return
  false
}

uninstall_plugins() {
  for plugin in $1 ; do
    wp plugin is-installed $plugin 2>/dev/null
    if [[ "$?" = "0" ]]
    then
      wp plugin uninstall $plugin
    fi
  done
}


main
