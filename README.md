# project-full-react-skeleton
Skeleton for project full react

## How to use it ?

### Create directory for this part of your project
```
mkdir admin
cd admin
```

### Clone this repository in your project
```
git clone git@github.com:code-202/project-full-react-skeleton.git .
```

### Optional, checkout to the expected tag
```
git checkout tags/<tagname>
```

### Remove git dependencies of skeleton
```
rm -rf .git
```

### Customize your environments variables
Edit and modify `.env` file.

### (Optional) Run docker container
```
make console
```

### Install node dependencies
```
yarn install
```

### Server-Side Rendering
To enable SSR, set `ssr` variable to `true` in both webpack config files

### Build sources
```
yarn build
```

### Run server
```
yarn start
```

## Optional

### Cookie Consent
First thing to do to enable @code-202/cookie-consent is to install the package
```
yarn add @code-202/cookie-consent
```

After that, uncomment every line about cookie in server.(ssr.)ts, container.ts, layout.tsx and app.scss.

### Security (with JWT)
First thing to do to enable @code-202/jwt is to install the package
```
yarn add @code-202/jwt
```

After that, uncomment every line about security in container.ts and layout.tsx
