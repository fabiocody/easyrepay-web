import {UserService} from './services/user.service';

const args = process.argv.slice(2);

function printHelper(): void {
    console.error('Wrong arguments:', args);
    console.log('Usage: node user-manager.ts [save|delete] username password [name]');
}

if (args.length > 0) {
    if (args[0] === 'save' && args.length >= 4) {
        const username = args[1];
        const password = args[2];
        const name = args[3];
        UserService.save(username, password, name)
            .then(() => {
                console.log('User saved');
                process.exit(0);
            })
            .catch(error => {
                console.error(error);
                process.exit(1);
            });
    } else if (args[0] === 'delete' && args.length >= 3) {
        const username = args[1];
        const password = args[2];
        UserService.delete(username, password)
            .then(() => {
                console.log('User deleted');
                process.exit(0);
            })
            .catch(error => {
                console.error(error);
                process.exit(1);
            });
    } else {
        printHelper();
        process.exit(1);
    }
} else {
    printHelper();
    process.exit(1);
}
