#!/usr/bin/env node
const { spawn } = require( 'child_process' );
const inquirer = require( 'inquirer' );
const program = require( 'commander' );

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

    let cmd = program.cmd || 'node_modules/.bin/sequelize';
    console.log( `----------------- cmd -----------------` );
    console.log( cmd );
    let args = [ 'migration:generate', '--name', ans.name ];
    if( cmd.match( /^npm run/g )) {
        args.unshift( '--' );
    }
    spawn( cmd, args, opts )
        .on( 'exit', () => {
            console.log( `----------------- Finish -----------------` );
        })
        .on( 'error', code => {
            console.log( `----------------- Error -----------------` );
            console.log( code );
        });
});
