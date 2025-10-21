ARG PYTHON_VERSION=3.11.2-bullseye

FROM python:${PYTHON_VERSION} AS python

# Build-Stage für Python-Wheels
FROM python AS python-build-stage
ARG BUILD_ENVIRONMENT=production

RUN apt-get update && apt-get install --no-install-recommends -y \
    build-essential \
    libpq-dev \
    gettext netcat \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY ./django/requirements .
RUN pip wheel --wheel-dir /usr/src/app/wheels -r ${BUILD_ENVIRONMENT}.txt

# Final-Stage
FROM python AS python-run-stage
ARG BUILD_ENVIRONMENT=production
ARG APP_HOME=/app

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV BUILD_ENV ${BUILD_ENVIRONMENT}

RUN apt-get update && apt-get install -y wget ca-certificates && rm -rf /var/lib/apt/lists/*
RUN wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -
RUN sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt bullseye-pgdg main" > /etc/apt/sources.list.d/pgdg.list'

RUN apt-get update && apt-get install --no-install-recommends -y \
    postgresql-client-15 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

ENV PATH="/usr/bin:/usr/lib/postgresql/bin:/usr/local/bin:$PATH"
WORKDIR ${APP_HOME}

RUN addgroup --system django && \
  adduser --system --ingroup django django

RUN mkdir -p ${APP_HOME}/backups && \
  chown django:django ${APP_HOME}/backups && \
  chmod 775 ${APP_HOME}/backups

RUN mkdir -p ${APP_HOME}/mediafiles && \
  chown django:django ${APP_HOME}/mediafiles && \
  chmod 775 ${APP_HOME}/mediafiles

COPY --from=python-build-stage /usr/src/app/wheels /wheels/

RUN pip install --no-cache-dir --no-index --find-links=/wheels/ /wheels/* \
  && rm -rf /wheels/

COPY --chown=django:django ./docker/django/entrypoint /entrypoint
RUN sed -i 's/\r$//g' /entrypoint
RUN chmod +x /entrypoint

COPY --chown=django:django ./docker/django/start /start
RUN sed -i 's/\r$//g' /start
RUN chmod +x /start

COPY --chown=django:django ./django ${APP_HOME}
RUN chown django:django ${APP_HOME}

USER django

ENTRYPOINT [ "/entrypoint" ]
