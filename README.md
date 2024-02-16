# Install reproca:

```sh
cd ~/Downloads/Some/Where
git clone https://github.com/aspizu/reproca
cd reproca
pip install .
```

# Workflow for client development.

Use Visual Studio Code to work on the client, open the `./client` folder in VSCode.

Make sure to run the server after pulling to update the `api.ts` file.

DO NOT open the repository root folder in VSCode, because then prettier will not work
properly.

Use `pnpm install` when you are inside the `./client` folder, don't run `pnpm` in the
root where there is no `package.json` file.

DO NOT use `npm`, we are using `pnpm`.

# Workflow for server development.

Use isort, ruff and pyright (Pylance extension for VSCode).

# Common workflow

Use prettier and ruff to format code. Set up your editor such that it formats the code
when saving files.

`prettier -w .`
