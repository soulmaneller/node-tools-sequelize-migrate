#!/usr/bin/env node
const { spawn } = require( 'child_process' );
const inquirer  = require( 'inquirer' );
const program   = require( 'commander' );
const path      = require( 'path' );

program
    .option( '-c, --cmd [command]', 'Command' )
    .parse( process.argv );

const questions = [
    {
        name: 'name',
        type: 'string',
        message: `Enter migration name`,
        validate: ans => ans.length > 0,
    }
];

inquirer.prompt( questions ).then( ans => {
    const opts = {
        stdio: 'inherit',
        shell: true,
        cwd: process.cwd(),
    };

    let cmd = program.cmd || path.join( 'node_modules', '.bin', 'sequelize' );
    let args = [ 'migration:generate', '--name', ans.name ];
    if( cmd.match( /^npm run/g )) {
        args.unshift( '--' );
    }
    spawn( cmd, args, opts )
        .on( 'exit', () => {
            process.exit();
        })
        .on( 'error', code => {
            console.log( `----------------- Error -----------------` );
            console.log( code );
        });
});
