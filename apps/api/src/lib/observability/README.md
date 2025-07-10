Observability

This directory contains all instrumentation and telemetry code for monitoring, tracing, logging, and exposing metrics from the application.

We follow a modern observability approach using **OpenTelemetry**, **Prometheus**, **Loki**, and **Tempo**, and visualize everything through **Grafana**.

---

## Directory Structure

```
lib/observability/
├── init.ts # Initializes all observability subsystems
├── context.ts # Request context injection (user ID, org ID, trace ID, etc.)
├── metrics/
│ └── http-metrics.ts # Example: track request duration, status codes
├── tracing/
│ └── tracer.ts # OpenTelemetry SDK and custom spans
├── logging/
│ └── logger.ts # Pino logger setup with context-aware logging
├── exporters/
│ └── otel-exporter.ts # OTLP exporters for traces/metrics
```

## Targeted Third-Party Services

| Tool                                   | Role                                  |
| -------------------------------------- | ------------------------------------- |
| [Grafana](https://grafana.com)         | Dashboard visualizations              |
| [Promoetheus](https://prometheus.io)   | Metrics collection and time series DB |
| [Loki](https://grafana.com/oss/loki)   | Centralized logs and aggregation      |
| [Tempo](https://grafana.com/oss/tempo) | Tracing backend system                |

## API Responsibilities

1. Emits structured logs via Pino
2. Expose a metrics endpoint `/metrics` with `prom-client` for Promethius to consume
3. Generating traces and spans using OTEL
4. Propagating context values (`request_id`, `user_id`, `organization_id`, `trace_id`)
5. Export telemetry data to third-party apps

## Third Party Apps Responsibilities

### Prometheus

- Pulls /metrics data from the app on a regular interval
- Stores time-series data (counters, gauges, histograms)
- Integrates with Grafana for visualization

### Loki

- Ingests logs (e.g., from stdout or files via Promtail)
- Stores logs in an index-optimized fashion
- Supports querying logs by trace ID, request ID, org ID, etc.
- Integrates tightly with Grafana

### Tempo

- Accepts OpenTelemetry traces via OTLP
- Stores spans with minimal indexing
- Enables distributed trace visualizations in Grafana

### Grafana

- Visual dashboard UI for metrics, logs, and traces
- Can correlate data across systems via trace_id, org_id, etc.
- Supports alerting and multi-tenant setups

## TODO

1. Implement core observability primitives
2. Add Promethius metrics endpoint
3. Add request-scoped context

- `request_id`, `trace_id`, `user_id`, `organization_id` injected into `req.context`
- attach the context to ALL logs and spans

4. Create a docker compose for local observability stack
5. Build some Grafana dashboards

- HTTP performance, org usage, error rates
- link logs to traces via trace ID

6. Export logs via stdout with traces

- use pino serializers to include `request_id`, `trace_id`, `user_id`, `organization_id`

## Starter Metrics to track

- HTTP request durations by route + status
- Per-tenant usage counts (flags created, API calls)
- DB query latency
- Background job queue depth
- External API error rate

## Notes

- Use `trace_id` and `organization_id` as first-class members in logs, spans, and metrics
