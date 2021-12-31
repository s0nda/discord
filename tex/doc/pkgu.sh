#!/bin/bash
#
#========================================================================================
# Description:
#   Copy this script in the same folder of the main tex file
#   (e.g. "main.tex" or "doc.tex").
#   Every time this script runs, it will download and install
#   (all) missed packages.
#   For safety, you should run this script TWO TIMES so that
#   all missing packages can be downloaded and installed.
#
# Usage:
#   ./pkgu.sh
# or
#   ./pkgu.sh $1
# 
# where $1 is an optional placeholder for the main TeX file
# to compile. Assume, the main TeX file is "main.tex".
# Then, the command would look like:
#
#   $ ./pkgu.sh main.tex
#
# You can also let the $1 be empty. The script will choose,
# compile and update packages for the TeX file, that lies
# in the same directory as this script "pkgu.sh".
# For example:
#
#   $ ./pkgu.sh
#
#========================================================================================
#
# CONSTANTS
#
#========================================================================================
DEFAULT_MAIN_TEX=doc.tex   # main tex file
#========================================================================================
DEFAULT_CTAN_SERVER="https://mirrors.ctan.org/macros/latex/contrib/"
DEFAULT_DOWNLOAD_LOCATION="/home/$(echo $USER)/Downloads/"
DEFAULT_TEX_LOCATION="/usr/share/texlive/texmf-dist/tex/latex/"
DEFAULT_FEX=zip               # file extension (*.zip)
DEFAULT_TMP_LOG=tmp.log
DEFAULT_PKG_LOG=pkg.log       # logs downloaded package(s)
#========================================================================================
#
# VARIABLES
#
#========================================================================================
_va=                          # general-purpose variable
_pkg=                         # package name
_ok=1                         # flag => 0 : OK (Done), 1 : NOK (Not done)
#========================================================================================
#
# FUNCTION (pkg_install)
#
# Install a TeX package. The first argument $1 contains
# the package name.
#
# @param:
#   $1 : package (name) to be installed, e.g. "imakeidx".
#   $2 : source path (location) where the package is
#        currently in, e.g. "/home/<user>/Downloads/".
#   $3 : destination path (location) where the package
#        should be installed/copied to, e.g.
#        "/usr/share/texlive/texmf-dis/tex/latex/".
#
# @return:
#    0 (zero)     : if the missed package is installed successfully
#   !0 (non-zero) : if the missed package cannot be installed
#
#========================================================================================
function pkg_install () {
  #
  # Local variables are declared by the keyword "local".
  # They are only visible inside the function scope.
  # When the function ends, the value of local variable(s)
  # will also "vanish".
  local __pkg="$1"              # obtain package name
  local __pkg_src="$2"          # download location
  local __pkg_dst="$3"          # install-destination
  local __ex=0                  # install-(exit)-code => 0 : success, 1 : no success
  #
  # Case distinction
  case ${__pkg} in
    "biblatex")
      echo "+ TeX Install Log: Install '${_pkg}' and 'Biber' from Debian Package Repository."
      echo "      $ sudo apt-get install texlive-bibtex-extra biber"
      sudo apt-get install texlive-bibtex-extra biber
      __ex=$(( ${__ex} | $? ))  # update exit-code ("$?")
      ;;
    "tikz")
      echo "+ TeX Install Log: Download 'pgf' with '${_pkg}.sty' from Debian Package Repository."
      echo "      $ sudo apt-get install texlive-pictures"
      sudo apt-get install texlive-pictures
      __ex=$(( ${__ex} | $? ))  # update exit-code ("$?")
      ;;
    *)
      #
      # Navigate to the folder (location) containing the
      # (downloaded) package
      cd "${__pkg_src}"
      # 
      # Extract zipped package to current directory (".").
      # The option "-q" indicates quite unpacking, "-d <dir>"
      # specifies the location (directory) which the package
      # is extracted to, and <dir> = "." refers to the
      # 
      # "current directory".
      # ${__pkg} = "imakeidx"
      # ${DEFAULT_FEX} = "zip"
      # ${__pkg}.${DEFAULT_FEX} = "imakeidx.zip"
      # sudo unzip -q imakeidx.zip -d .
      sudo unzip -q ${__pkg}.${DEFAULT_FEX} -d .
      #
      # Nagivate to inside the package, i.e. <location>/<package>
      cd "${__pkg}/"
      #
      # Check if file "<package>.sty" does exist.
      # If no, then check further if file "<package>.ins"
      # or/and "<package>.dtx" does exist.
      # If yes, then create .sty file (i.e.
      # "<package>.sty") from either .ins- or
      # .dtx file.
      #
      # Option "-1" bedeutet, dass jede aufgelistete Zeile
      # nur den Dateinamen beinhaltet und keine weitere
      # Informationen (z.B. Berechtigung, Änderungsdatum etc.).
      # 
      _va="$(ls -1 | grep '.sty')"              # check .sty file
      if [ -z "${_va}" ]; then                  # if ${_va} is empty => .sty file not exist
        _va="$(ls -la | grep '.ins')"           # check .ins file
        if [ -z "${_va}" ]; then                # if ${_va} is empty => .ins file not exist
          _va="$(ls -1 | grep '.dtx')"          # check .dtx file
          if [ -z "${_va}" ]; then              # if ${_va} is empty => .dtx file not exist
            return 1                            # error code (1). Exit function.
          else                                  # .dtx file exists
            sudo tex "${__pkg}.dtx"             # create .sty file from .dtx
          fi
        else                                    # .ins file exists
          sudo tex "${__pkg}.ins"               # create .sty file from .ins
        fi
        __ex=$(( ${__ex} | $? ))                # update exit-code ("$?")
        echo "+ TeX Install Log: File '${__pkg}.sty' is created."
      else
        echo "+ TeX Install Log: File '${__pkg}.sty' is identified."
      fi
      #
      # Create new folder <package>/ in "${__pkg_dst}" or
      # "${DEFAULT_TEX_LOCATION}" or
      # "/usr/share/texlive/texmf-dis/tex/latex/"
      sudo mkdir "${__pkg_dst}${__pkg}/"
      echo "+ TeX Install Log: TeX folder '${__pkg_dst}${__pkg}/' is created."
      #
      # Copy file "<package>.sty" and all related files
      # "<package>.*" to the newly created folder
      # "${__pkg_dst}$<package>/" or
      # "${DEFAULT_TEX_LOCATION}<package>/" or
      # "/usr/share/texlive/texmf-dis/tex/latex/<package>/"
      #sudo cp ${__pkg}.* "${__pkg_dst}${__pkg}/"
      echo "+ TeX Install Log: Following files '${__pkg}.*' are copied to folder '${__pkg_dst}${__pkg}/'."
      for f in $(ls -1 | grep "${__pkg}"); do
        if [ "$f" != *"pdf"* ]; then
          sudo cp $f "${__pkg_dst}${__pkg}/"    # copy files
          echo "+   $f"
        fi
      done
      #
      # Change mode (access rights) for all .sty file(s).
      # They should have the access rights "-rw-r--r--"
      # or "0644" (octal notation).
      #
      # The 1st command "chmod a=r *.sty" causes that
      # all ("a") users of all groups (i.e. a = {u, g, o}
      # where u = user, g = group, o = other(s)) can
      # access/read ("=r") the .sty files ("*.sty").
      #
      #   $ chmod a=r *.sty
      #   $ -r--r--r--
      #
      # The 2nd command "chmod u+w *.sty" causes that
      # only current user ("u") gets the writing access
      # ("+w") to the .sty files.
      #
      #   $ chmod u+w *.sty
      #   $ -rw-r--r--
      #
      # The 3rd command "chmod 0644" is just the
      # combination / abbreviation of the last two
      # commands above. Furthermore, it uses the 
      # octal notation "0644".
      # 
      #     S  U  G  O
      #     0  6  4  4
      # 
      # where "S = Sticky-Bit" should be zero (0),
      # "U = User" has read-write-access "rw-" or
      # "6" because 6 = 4 + 2,+ 0,
      # "G = Group" has read-only access "r--" or
      # "4" because 4 = 4 + 0,
      # "O = Group" has read-only access "r--" or
      # "4" because 4 = 4 + 0,
      # and:
      #       # | access          | rwx | rwx
      #      ===+=================+=====+=====
      #       7 | full            | 111 | rwx
      #       6 | read + write    | 110 | rw-
      #       5 | read + execute  | 101 | r-x
      #       4 | read-only       | 100 | r--
      #       3 | write + execute | 011 | -wx
      #       2 | write-only      | 010 | -w-
      #       1 | execute-only    | 001 | --x
      #       0 | none            | 000 | ---
      #
      cd "${__pkg_dst}${__pkg}/"
      #sudo chmod a=r *.sty
      #sudo chmod u+w *.sty
      #sudo chmod 0644 *.sty
      sudo chmod 0644 ${__pkg}.*
      #
      # Update exit-code
      __ex=$(( ${__ex} | $? ))
      #
      # Go back to download (source) location, and<ext>
      # remove all downloaded package files
      cd ${__pkg_src}
      sudo rm -rf ${__pkg} ${__pkg}.${DEFAULT_FEX}
      echo "+ TeX Install Log: Temporarily downloaded file(s) and folder(s) are removed."
      ;;
  esac
  #
  # exit code (0) for successful operation
  return ${__ex}
}
#========================================================================================
#
# FUNCTION (pkg_download)
#
# Download the (missing) package (.zip) from CTAN server.
#
# @param:
#   $1 : package (name) to be downloaded, e.g. "imakeidx"
#   $2 : path (location) where the package is downloaded
#        and stored in, e.g. "/home/<user>/Downloads/"
#        or "${DEFAULT_DOWNLOAD_LOCATION}"
#
# @return:
#    0 (zero)     : if the missed package was downloaded successfully
#   !0 (non-zero) : if the missed package cannot be downloaded
#
#========================================================================================
function pkg_download () {
  #
  # Local variables are declared by the keyword "local".
  # They are only visible inside the function scope.
  # When the function ends, the value of local variable(s)
  # will also "vanish".
  local __pkg="$1"              # package name
  local __pkg_dl="$2"           # download folder
  local __ex=0                  # download (exit) code => 0 : success, 1 : no success
  #
  # Handle extra package libraries as "biblatex" (biber)
  #pkg_handle_extra_libs "${__pkg}"
  if [ -z ${__pkg} ]; then      # if ${__pkg} is empty (zero)
    _ok=0                       # [OK] => All packages are installed => Done/End.
    #echo "+ TeX Download Log: Your TeX library is up to date. No package is missing."
    #echo "+ TeX Update Log: Done. [OK]"
  else
    case ${__pkg} in
      "biblatex")
        echo "? TeX Download Warning: Package '${_pkg}' with 'Biber' is missing!"
        echo "+ TeX Download Log: Download '${_pkg}' and 'Biber' from Debian Package Repository."
        ;;
      "tikz")
        echo "? TeX Download Warning: Package 'pgf' with '${_pkg}' is missing!"
        echo "+ TeX Download Log: Download 'pgf' with '${_pkg}.sty' from Debian Package Repository."
        ;;
      *)
        #
        # other package(s)
        echo "? TeX Download Warning: Package '${_pkg}' is missing!"
        echo "+ TeX Download Log: Download package '${_pkg}' from '${DEFAULT_CTAN_SERVER}${_pkg}.${DEFAULT_FEX}'."
        #
        # Remove all (previously downloaded) old package files
        sudo rm -rf "${__pkg_dl}/${__pkg}" "${__pkg}.${DEFAULT_FEX}"
        #
        # Download (wget) the missing package.
        # Store all protocol output information to external
        # log file ${DEFAULT_TMP_LOG}.
        #
        # WGET-Options:
        # > option -O (--output-document=FILE) specifies the local
        #   name of the downloaded file, e.g. "-O FILE" or
        #   "-O file.zip",
        # > option -P (--directory-prefix=LOCATION) specifies
        #   the storing location (folder) for the downloaded file,
        #   e.g. "-P LOCATION/..",
        # > option -o (--output-file=FILE) specifies the log file
        #   which all protocol output information are written in,
        #   e.g. "-o tmp.log"
        #
        # Example: Download package "imakeidx.zip" from CTAN
        #   $ wget -O imakeidx.zip \
        #          -P "/home/$(echo $USER)/Downloads/" \
        #          -o "/home/$(echo $USER)/Downloads/tmp.log" \
        #           https://mirrors.ctan.org/macros/latex/contrib/imakeidx.zip
        #
        #wget -O ${__pkg}.${DEFAULT_FEX} \  <== -O and -P cause conflicts
        wget -P "${__pkg_dl}" \
             -o "${DEFAULT_TMP_LOG}" \
                "${DEFAULT_CTAN_SERVER}${__pkg}.${DEFAULT_FEX}"
        #
        # Get exit code (__ex) after wget execution.
        __ex="$(echo $?)"          # exit code => 0 : success, 8 : not success
        #
        # Assign empty string to (global) variable "_va"
        _va=""
        #
        # Read & evaluate the log file ${DEFAULT_TMP_LOG}.
        # If the log file contains the text "404 Not Found" or
        # "404: Not Found.", then the desired package couldn't
        # be downloaded. This text passage "404 Not Found" is
        # then stored in variable "_va" to indicate that the
        # download process was not successful. Otherwise, if 
        # the log file doesn't contain the text "404 Not
        # Found" and "404: Not Found.", then "_va" remains
        # empty, i.e. the download process was successful.
        # 
        # The option "-E" of grep-command allows the use of
        # regular pattern(s) with OR (|) operator.
        _va=$(grep -E '404 Not Found|404: Not Found.' ${DEFAULT_TMP_LOG})
        rm -f ${DEFAULT_TMP_LOG}
        #
        # if ${_va} is not empty => unsuccess
        if [ ! -z "${_va}" ]; then      # _va contains "404"
          __ex=$(( ${__ex} | 8 ))       # unsuccess (<> 0)
        fi
        ;;
    esac
  fi
  #
  return ${_ex};
}
#========================================================================================
#
# FUNCTION (pkg_tex)
#
# Compile the TeX document and create output (ps, dvi, pdf).
#
# @param:
#   $1 : name of TeX file to be compiled
#
#========================================================================================
function pkg_tex () {
  #
  # Check if argument $1 is empty (-z) or not (!)
  if [ ! -z $1 ]; then          # if $1 is not empty..
    _va=$1
  else                          # if $1 is empty..
    _va=${DEFAULT_MAIN_TEX}
  fi
  #
  # Compile main (tex) file, and store the return value
  # from grep-execution to variable.
  #
  # The pipe (|) and grep-command are needed for extracting
  # (finding) the following line
  #
  #   "! LaTeX Error: File `<package>.sty' not found."
  #
  # from log.
  #
  # Result: _va = "! LaTeX Error: File `<package>.sty' not found."
  #
  # The string '.sty'\'' not found.' below in code
  # can be understood as following concatenations:
  #
  #     '.sty'  +  \'  +  ' not found.'
  #       (1)     (2)         (3)
  # or
  #
  #     ".sty"  +  \'  +  " not found."
  #
  # That means, this string is divided in 3 parts:
  #   (1) '.sty'
  #   (2) \'
  #   (3) ' not found.'
  #
  # Part (1) contains the (sub)string '.sty' (without
  # surrounding quotes).
  # Part (2) \' provides a single-quote (') by using
  # the escapping backslash (\).
  # Part (3) contains the (sub)string ' not found.'
  # (without surrounding quotes).
  # The sequence '\'' (spoken: quote backslash quote
  # quote) within string '.sty'\'' not found.' has
  # the following meaning:
  #   - first quote (') closes first substring '.sty';
  #   - then, escape-sequence (\') for single-quote;
  #   - finally, thirst quote (') starts third string.
  #
  echo "+ TeX Compile Log: Creating file '${DEFAULT_MAIN_TEX}'.."
  #_va=$(pdflatex -synctex=1 -interaction=nonstopmode ${_va} | grep '.sty'\'' not found.')
  _va=`pdflatex -synctex=1 -interaction=nonstopmode ${_va} | grep '.sty'\'' not found.'`
  #
  # Extract substring '<package>' from line:
  #    "! LaTeX Error: File `<package>.sty' not found."
  # The cut-command splits this line in 2 substrings
  # delimited by apostrophe (-d'`'), and yields the 2nd
  # substring/field (-f2), i.e. "<package>.sty not found.",
  #
  #   ["! LaTeX Error: File "]  ["<package>.sty' not found."]
  #            1.                           2.
  # 
  # Result: _va = "<package>.sty not found."
  #
  _va=$(echo ${_va} | cut -d'`' -f2)
  #
  # Extract the package name (<package>) from substring:
  #     "<package>.sty' not found."
  # The cut-command splits this substring in 2 parts
  # delimited by dot (-d'.'), and yields the 1st part/field
  # (-f1), i.e. "<package>",
  #
  #   ["<package>"]  ["sty' not found."]
  #         1.               2.
  #
  # Result: _va  = "<package>"
  #
  # where <package> is a place holder for package name
  # as "imakeidx", "csquotes" etc.
  #
  _va=$(echo ${_va} | cut -d'.' -f1)
  #
  # Assign varible "_pkg" string value (package name)
  # from general-purpose variable "_va".
  _pkg=${_va}
}
#========================================================================================
#
# FUNCTION (pkg_update_lib)
#
# Update TeX library (texhash).
#
#========================================================================================
function pkg_update_lib () {
  sudo texhash                  # update TeX library
}
#========================================================================================
#
# FUNCTION (main)
#
#========================================================================================
function main () {
  #
  # get current location (directory)
  _pwd="$(pwd)"
  #
  # infinite while-loop with colon (":")
  while :
  do
    #
    # compile main TeX file
    pkg_tex $1
    #
    # download missing TeX package, and return (exit) code
    pkg_download "${_pkg}" "${DEFAULT_DOWNLOAD_LOCATION}"
    #
    # get exit code ("$?") from previous command execution
    # (pkg_download) and evaluate/check if exit code is zero.
    # The exit code ("$?") is the return value of the last
    # function call (pkg_download).
    # "$?" is used to determine the exit code returned from
    # last operation.
    if [ "$?" -ne "0" ]; then       # exit code ($?) is not equal (-ne) zero (0)
      echo "! TeX Download Error: Package '${_pkg}' cannot be downloaded."
      echo "! TeX Download Error: Check the package Url and retry. Program aborted!"
      echo "Failed!"
      exit 1                        # exit program, with (error) code 1
    else                            # exit code ($?) is zero (0)
      if [ "${_ok}" -eq "0" ]; then # 0 : [OK] => All packages are installed => Done/Finish
        echo "+ TeX Download Log: Your TeX library is up to date. No package is missing."
        echo "+ TeX Update Log: Done."
        echo "OK"
        break                       # Break while-loop
      else                          # 1 : [NOK] => Not all packages are installed yet
        echo "+ TeX Download Log: Package '${_pkg}' has been downloaded and stored" \
             "in ${DEFAULT_DOWNLOAD_LOCATION}."
      fi
    fi
    #
    # install downloaded TeX package
    pkg_install "${_pkg}" "${DEFAULT_DOWNLOAD_LOCATION}" "${DEFAULT_TEX_LOCATION}"
    #
    # get exit code ("$?") from previous command execution
    # (pkg_install) and evaluate/check if exit code is zero.
    # "$?" is used to determine the exit code from last operation.
    if [ "$?" -eq "0" ]; then
      echo "${_pkg}" >> "${_pwd}/${DEFAULT_PKG_LOG}"
      echo "+ TeX Install Log: Package '${_pkg}.${DEFAULT_FEX}' has been successfully installed."
    else
      echo "! TeX Install Error: Package '${_pkg}.${DEFAULT_FEX}' couldn't be installed."
      echo "! TeX Install Error: Check the package's files and retry. Program aborted!"
      echo "Failed!"
      exit 1                        # Exit program, with error code 1
    fi
    #
    # go back to script's current directory
    cd ${_pwd}
    #
    # update TeX library
    pkg_update_lib
  done
  exit 0
}
#========================================================================================
#
# START
#
#========================================================================================
main $1
