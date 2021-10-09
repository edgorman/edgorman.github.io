export function help(t){
    t.echo('Here is a list of the available commands:\n');

    t.echo('[[b;;]cat] \t\t Prints file to terminal')
    t.echo('[[b;;]cd] \t\t\t Change the current directory');
    t.echo('[[b;;]clear] \t\t Clears the terminal screen');
    t.echo('[[b;;]debug] \t\t Prints debug info for terminal');
    t.echo('[[b;;]echo] \t\t Prints the string to terminal')
    t.echo('[[b;;]exit] \t\t Closes the current window')
    t.echo('[[b;;]login] \t\t Login as a user')
    t.echo('\t\t\t [[b;;]-u] \t Username')
    t.echo('\t\t\t [[b;;]-p] \t Password')
    t.echo('[[b;;]ls] \t\t\t Displays files in current directory');
    t.echo('\t\t\t [[b;;]-a] \t Include hidden files')
    t.echo('\t\t\t [[b;;]-l] \t Long listing format')
    t.echo('[[b;;]whoami] \t\t Prints name of current user');

    t.echo('\nYou can also tab complete file names and\nrun executables by entering the file name\n');
}