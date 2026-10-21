import json


def payload(**changes):
    value = {
        "word": "ubuntu", "language_name": "isiXhosa / isiZulu",
        "language_code_optional": "", "pronunciation": "oo-BOON-too",
        "definition": "A relational idea of personhood expressed through community.",
        "usage_example": "Ubuntu reminds us that a person becomes a person through other people.",
        "cultural_context": "Meanings and uses vary across communities and contexts.",
        "usage_category": "proverb", "region_optional": "Southern Africa",
        "evidence_urls": ["https://example.org/ubuntu"],
    }
    value.update(changes)
    return json.dumps(value)


def supported_model(**changes):
    value = {"meaningful_information": True, "internally_coherent": True,
             "language_attribution_supported": True, "evidence_supports_interpretation": True,
             "legitimate_variation_possible": True, "reason": "The evidence supports this documented interpretation."}
    value.update(changes)
    return json.dumps(value)


def test_valid_word_blooms(direct_vm, direct_deploy, direct_alice):
    contract = direct_deploy("contracts/main.py"); direct_vm.sender = direct_alice
    direct_vm.mock_web(r".*example\.org/ubuntu.*", {"status": 200, "body": "Ubuntu has related community-centred interpretations."})
    direct_vm.mock_llm(r".*cultural language registry.*", supported_model())
    entry_id = contract.submit_entry(payload())
    record = json.loads(contract.get_entry(entry_id))
    assert record["assessment_status"] == "ACCEPTED"
    assert record["documentation_level"] == "SUPPORTED"
    assert json.loads(contract.list_entries(0, 5, True))["entries"][0]["id"] == entry_id


def test_oral_language_without_urls_is_inconclusive_not_rejected(direct_vm, direct_deploy, direct_alice):
    contract = direct_deploy("contracts/main.py"); direct_vm.sender = direct_alice
    direct_vm.mock_llm(r".*cultural language registry.*", supported_model(language_attribution_supported=False, evidence_supports_interpretation=False))
    entry_id = contract.submit_entry(payload(evidence_urls=[]))
    record = json.loads(contract.get_entry(entry_id))
    assert record["assessment_status"] == "INCONCLUSIVE"
    assert record["documentation_level"] == "LIMITED"


def test_incoherent_submission_rejected(direct_vm, direct_deploy, direct_alice):
    contract = direct_deploy("contracts/main.py"); direct_vm.sender = direct_alice
    direct_vm.mock_web(r".*example\.org/ubuntu.*", {"status": 200, "body": "Different content."})
    direct_vm.mock_llm(r".*cultural language registry.*", supported_model(internally_coherent=False, evidence_supports_interpretation=False))
    entry_id = contract.submit_entry(payload())
    assert json.loads(contract.get_entry(entry_id))["assessment_status"] == "REJECTED"


def test_invalid_and_duplicate_entries(direct_vm, direct_deploy, direct_alice):
    contract = direct_deploy("contracts/main.py"); direct_vm.sender = direct_alice
    with direct_vm.expect_revert("Invalid word"):
        contract.submit_entry(payload(word=""))
    direct_vm.mock_web(r".*example\.org/ubuntu.*", {"status": 200, "body": "Supported."})
    direct_vm.mock_llm(r".*cultural language registry.*", supported_model())
    contract.submit_entry(payload())
    with direct_vm.expect_revert("already exists"):
        contract.submit_entry(payload(definition="A second proposed definition."))


def test_dialect_variation_is_preserved(direct_vm, direct_deploy, direct_alice):
    contract = direct_deploy("contracts/main.py"); direct_vm.sender = direct_alice
    direct_vm.mock_web(r".*example\.org/ubuntu.*", {"status": 200, "body": "Sources document several legitimate senses."})
    direct_vm.mock_llm(r".*cultural language registry.*", supported_model(legitimate_variation_possible=True))
    entry_id = contract.submit_entry(payload(definition="One documented meaning among multiple community uses."))
    facts = json.loads(contract.get_entry(entry_id))["assessment_facts"]
    assert facts["legitimate_variation_possible"] is True


def test_pagination_bounds(direct_vm, direct_deploy):
    contract = direct_deploy("contracts/main.py")
    with direct_vm.expect_revert("Page size must be 1 to 25"):
        contract.list_entries(0, 26, False)


def test_equivalence_validator_is_substantive():
    source = open("contracts/main.py", encoding="utf-8").read()
    validator = source.split("def validator(leader_result):", 1)[1].split("assessment =", 1)[0]
    assert "assess_entry(entry_memory)" in validator
    assert "assessment_signature" in validator
    assert "return True" not in validator
    assert all(field in source for field in ("internally_coherent", "language_attribution_supported", "legitimate_variation_possible"))
