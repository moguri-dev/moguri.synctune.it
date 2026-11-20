# sql-not-so-lite

Technical reference for **Settings / Integrations / sql-not-so-lite**. The app shows a short summary;
this page keeps the full detail.

## Page help

Connect to a daemon you already run. Moguri never starts it, triggers its Home scan, sends a database
path, or exposes its private store. This is a control-plane host connection (made from the machine
running the Moguri service), not the selected agent's Remote endpoint.

## Enable switch

Previously labeled "Enable the explicitly configured existing daemon". Enabling it only uses the
endpoint saved above.

## Warning

Upstream's default listener has no authentication/TLS. Prefer loopback; network endpoints require
HTTPS. The external daemon controls its own file access. Moguri does not grant it access to encrypted
state or manage its scan policy.

## Status

Before Verify runs, the connection has not been observed. Saving configuration never claims the daemon
is connected.
