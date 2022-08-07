#!/bin/sh
while (true) do
sleep 1
curl -H 'Content-Type: application/json' --data '{"jsonrpc":"2.0", "id": 1, "method": "evm_mine", "params": [] }' http://localhost:8545
done

