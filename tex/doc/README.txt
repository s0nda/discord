
1. Open "update.sh" with an editor of your choice,
   and change the name (path) of your main TeX file:

	DEFAULT_MAIN_TEX=<name_of_main_TeX_file>

   Example:

	DEFAULT_MAIN_TEX=thesis.tex

   Save change(s) and close.

2. Open "build.sh" and do the same change as above.

3. Run "update.sh" to update TeX library and download
   (missed) packages:

	$ ./update.sh

   You can also give an argument for other name (path)
   of main TeX file. For example:

	$ ./update.sh <name_of_main_TeX_file>

4. Afterwards, run "build.sh" to compile and create
   pdf document:

	$ ./build.sh

5. View pdf document with Okular:

	$ okular <name_of_document>.pdf
	
