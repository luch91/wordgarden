# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }

from genlayer import *


class WordGardenRegistry(gl.Contract):
    """Checkpoint-A proof contract; expanded only after live write/read succeeds."""

    proof_value: str
    proof_writer: Address
    proof_writes: u256

    def __init__(self):
        self.proof_value = "preflight"
        self.proof_writer = gl.message.sender_address
        self.proof_writes = u256(0)

    @gl.public.write
    def write_proof(self, value: str) -> None:
        if len(value) < 1 or len(value) > 64:
            raise gl.UserError("Proof value must contain 1 to 64 characters")
        self.proof_value = value
        self.proof_writer = gl.message.sender_address
        self.proof_writes += u256(1)

    @gl.public.view
    def read_proof(self) -> dict:
        return {
            "value": self.proof_value,
            "writer": str(self.proof_writer),
            "writes": int(self.proof_writes),
        }
