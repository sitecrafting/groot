#!/usr/bin/env bash

RED="tput setaf 1"
BOLD="tput bold"
RESET="tput sgr 0"


function usage() {
  echo 'Usage:'
  echo
  echo '  build-release.sh RELEASE'
  echo
  echo 'RELEASE: the name of the release, e.g. "v1.2.3"'
  echo
}

function fail() {
  echo $($RED; $BOLD)
  echo "$1"
  echo $($RESET)
  usage
  exit 1
}

function main() {
  if ! [[ -f ./style.css ]] ; then
    fail 'Error: not in root groot directory?'
  fi

  RELEASE="$1"

  if [[ -z "$RELEASE" ]] ; then
    fail 'Error: no release number specified'
  fi

  # prompt for the letter "v"
  first_char="${RELEASE:0:1}"
  if ! [[ "$first_char" = 'v' ]] ; then
    read -p "Prepend a 'v' (v${RELEASE})? (y/N) " prepend
    if [[ "$prepend" = "y" ]] ; then
      RELEASE="v${RELEASE}"
    fi
  fi

  # check tag
  git rev-parse --verify "$RELEASE" 2>/dev/null
  if ! [[ "$?" -eq 0 ]] ; then

    # prompt for creating a tag
    read -p "'${RELEASE}' is not a Git revision. Create tag ${RELEASE}? (y/N) " create
    if ! [[ "$create" = "y" ]] ; then
      echo 'aborted.'
      exit
    fi

    # prompt for annotation
    read -p "Annotate this tag? (leave blank for no annotation) " annotation

    if [[ "$annotation" ]] ; then
      git tag "$RELEASE" -am "$annotation"
    else
      git tag "$RELEASE"
    fi
  fi

  tar_name="groot-${RELEASE}.tar.gz"
  zip_name="groot-${RELEASE}.zip"

  # hackishly create a symlink groot directory, so that when extracted, the
  # archives we create have a top-level directory
  release_dir="groot-${RELEASE}"
  mkdir "$release_dir"

  # archive plugins distro files inside a top-level groot/ dir
  for path in .gitignore \
    *.php \
    assets.version \
    style.css \
    style.css.map \
    print.css \
    print.css.map \
    webpack.config.js \
    acf-json/ \
    dist/ \
    img/ \
    js/ \
    less/ \
    lib/ \
    views/ \
    package.json \
    yarn.lock \
    screenshot.png \
    LICENSE.txt \
    README.md
  do
    # put all our assets in the temporary release directory,
    # skipping swapfiles
    rsync --exclude='*.swp' -avh "$path" "$release_dir/$path"
  done

  zip -r "$zip_name" "$release_dir"
  tar -cvzf "$tar_name" "$release_dir"

  # clean up
  rm -rf ./$release_dir

  echo "Created ${tar_name}, ${zip_name}"

  create_github_release "$RELEASE" "$tar_name" "$zip_name"
}

function create_github_release() {
  if [[ $(which hub) ]] ; then
    echo $($BOLD)hub detected! You win at Git!$($RESET)
    read -p 'Create a GitHub release? (y/N) ' create
    if [[ "$create" = "y" ]] ; then
      echo 'pushing latest changes and tags...'
      git push origin master
      git push --tags
      hub release create --prerelease \
        --attach="$2" \
        --attach="$3" \
        --edit --message="$1" \
        "$1"
    else
      echo 'skipping GitHub release.'
    fi
  fi
}


POSITIONAL=()
while [[ $# -gt 0 ]]
do
key="$1"

case $key in
  -h|--help)
    # show usage and bail
    usage
    exit
    ;;
  *)
    POSITIONAL+=("$1") # save it in an array for later
    shift # past argument
    ;;
esac
done
set -- "${POSITIONAL[@]}" # restore positional parameters



main "$@"
