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
  ln -sfn . groot

  # archive plugins distro files inside a top-level groot/ dir
  tar -cvzf "$tar_name" \
    groot/*.php \
    groot/dist \
    groot/img \
    groot/js \
    groot/less \
    groot/lib \
    groot/package.json \
    groot/views \
    groot/LICENSE.txt \
    groot/README.md

  # ditto for zip
  zip -r "${zip_name}" \
    groot/*.php \
    groot/dist \
    groot/img \
    groot/js \
    groot/less \
    groot/lib \
    groot/package.json \
    groot/views \
    groot/LICENSE.txt \
    groot/README.md

  # remove hackish symlink
  rm ./groot

  echo "Created ${tar_name}, ${zip_name}"
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