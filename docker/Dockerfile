FROM code202/node:24.17

ARG USER
ARG UID=1000
ARG CONTAINER_SHELL=/bin/bash

RUN <<-EOF
	adduser -u "$UID" -h /home/developer "$USER" -s "$CONTAINER_SHELL" -D
EOF

USER ${USER}

