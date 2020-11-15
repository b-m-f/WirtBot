import simple_network from './test_creating_simple_network.mjs'

const tests = async () => {
    await simple_network();
}

const main = async () => {
    try {
        await tests()
        console.log("All tests ran successfully");
    } catch (error) {
        console.error(error);
    }
}
main();