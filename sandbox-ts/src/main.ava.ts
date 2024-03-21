import { Worker, NearAccount } from 'near-workspaces';
import anyTest, { TestFn } from 'ava';

const test = anyTest as TestFn<{
  worker: Worker;
  accounts: Record<string, NearAccount>;
}>;

test.beforeEach(async (t) => {
  // Init the worker and start a Sandbox server
  const worker = await Worker.init();

  // Deploy contract
  const root = worker.rootAccount;
  const contract = await root.createSubAccount('test-account');
  // Get wasm file path from package.json test script in folder above
  await contract.deploy(
    process.argv[2],
  );

  //Create user: alice
  const alice = await root.createSubAccount('alice');

  // Save state for test runs, it is unique for each test
  t.context.worker = worker;
  t.context.accounts = { root, contract, alice };
});

test.afterEach.always(async (t) => {
  // Stop Sandbox server
  await t.context.worker.tearDown().catch((error) => {
    console.log('Failed to stop the Sandbox:', error);
  });
});

test('Should return "Not found" if accountId is not found', async (t) => {
  const { contract, alice } = t.context.accounts;
  const result = await contract.view('get_message', { account_id: alice.accountId });
  t.is(result, "Not Found");
});

test('Should save message by accountId and retrive it by accountId', async (t) => {
  const { contract, alice } = t.context.accounts;
  const message = "Hello World";
  await alice.call(contract, 'set_message', { message });
  const result = await contract.view('get_message', { account_id: alice.accountId });
  t.is(result, message);
});