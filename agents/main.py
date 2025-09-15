#!/usr/bin/env python3
"""
Consumer Complaint Agentic System - Main Entry Point
Run this to process your complaint against Trivago
"""

import asyncio
import json
from pathlib import Path
from datetime import datetime

# Your case details
CUSTOMER_INFO = {
    "name": "Jarad DeLorenzo",
    "email": "jaradd@gmail.com",
    "location": "Hackettstown, New Jersey",
    "state": "NJ",
    "phone": "Available if needed",
    "card_last_four": "2177",
    "address": "Hackettstown",
    "city": "Hackettstown",
    "zip": "08826"
}

MERCHANT_INFO = {
    "name": "TRIVAGODEALS",
    "website": "https://www.trivago.deals/",
    "address": "Greenwich, CT",
    "city_state_zip": "Greenwich, CT, US",
    "email": "contactus@trivagodeals.com",
    "parent_company": "Trivago Deals"
}

TRANSACTION_DETAILS = {
    "date": "August 8, 2025",
    "time": "00:57:45 UTC",
    "amount": 366.18,
    "order_id": "11282346",
    "confirmation": "TRC1205AAJ444",
    "checkin_date": "August 8, 2025",
    "checkout_date": "August 9, 2025",
    "hotel": "Le Voyageur - a Red Collection Hotel",
    "hotel_location": "Wildwood, New Jersey"
}

COMPLAINT_TEXT = """
Trivagodeals (trivago.deals) charged my credit card $366.18 at 12:57 AM on August 8, 2025,
for a hotel reservation with check-in on THE SAME DAY. This is physically impossible - 
I cannot book and check into a hotel at 12:57 AM for the same day.

Key fraud indicators:
1. Transaction time: 00:57:45 UTC on August 8, 2025
2. Check-in date: August 8, 2025 (SAME DAY)
3. Hotel: Le Voyageur - a Red Collection Hotel, Wildwood, NJ
4. They claim the room is "non-refundable" despite the impossible booking scenario
5. My dispute was denied with clearly fraudulent reasoning
6. Confirmation number: TRC1205AAJ444
7. Order ID: 11282346
8. They're hiding behind "terms of service" for a clearly impossible transaction

This is a clear case of fraud through website manipulation and deceptive practices.
They're exploiting a technical bug to steal money from consumers.
"""

async def main():
    """Main execution function"""
    print("=" * 80)
    print("CONSUMER COMPLAINT PROCESSING SYSTEM")
    print("Fighting Back Against Trivago Deals Fraud")
    print("=" * 80)
    print()
    
    # Check if we're running in simple mode (no agent framework yet)
    # For now, we'll generate documents directly
    
    from tools.document_generator import DocumentGeneratorTools
    from tools.evidence_analyzer import EvidenceAnalyzerTools
    from tools.legal_research import LegalResearchTools
    
    print("Initializing tools...")
    doc_tools = DocumentGeneratorTools()
    evidence_tools = EvidenceAnalyzerTools()
    legal_tools = LegalResearchTools()
    
    print("\n📊 ANALYZING EVIDENCE...")
    print("-" * 40)
    
    # Analyze timeline
    timeline = evidence_tools.analyze_timeline(
        transaction_time="2025-08-08T00:57:45Z",
        service_date="2025-08-08T12:00:00Z"
    )
    
    print(f"Transaction Time: {timeline['transaction_timestamp']}")
    print(f"Service Time: {timeline['service_timestamp']}")
    print(f"Is Impossible: {timeline['is_impossible']}")
    print(f"Fraud Indicators: {timeline['fraud_indicators']}")
    
    print("\n⚖️ RESEARCHING APPLICABLE LAWS...")
    print("-" * 40)
    
    # Research laws
    federal_laws = legal_tools.research_federal_laws("credit card fraud billing", "NJ")
    state_laws = legal_tools.research_state_laws("NJ", "consumer fraud")
    
    print(f"Applicable Federal Laws: {federal_laws['total_applicable']}")
    print(f"State Has Treble Damages: {state_laws['has_treble_damages']}")
    
    # Calculate damages
    damages = legal_tools.calculate_damages(
        actual_damages=366.18,
        laws_violated=["FCBA", "CFA"],
        state="NJ"
    )
    print(f"Potential Recovery: ${damages['total_potential_recovery']:.2f}")
    
    print("\n📝 GENERATING DOCUMENTS...")
    print("-" * 40)
    
    # Generate demand letter
    print("1. Creating Demand Letter...")
    demand_letter = doc_tools.generate_demand_letter(
        customer_info=CUSTOMER_INFO,
        merchant_info=MERCHANT_INFO,
        transaction_details=TRANSACTION_DETAILS,
        violations=[
            {"law": "FCBA", "description": "Billing error - impossible transaction", "citation": "15 U.S.C. § 1666"},
            {"law": "NJ CFA", "description": "Unconscionable commercial practice", "citation": "N.J.S.A. 56:8-2"},
            {"law": "Wire Fraud", "description": "Electronic fraud scheme", "citation": "18 U.S.C. § 1343"}
        ],
        demand_amount=366.18
    )
    
    # Save demand letter
    output_dir = Path("/home/delorenj/d/Projects/TrivagoShitbags/outputs")
    letters_dir = output_dir / "letters"
    letters_dir.mkdir(parents=True, exist_ok=True)
    
    with open(letters_dir / "demand_letter.txt", "w") as f:
        f.write(demand_letter)
    print("   ✓ Saved to outputs/letters/demand_letter.txt")
    
    # Generate CFPB complaint
    print("2. Creating CFPB Complaint...")
    cfpb_complaint = doc_tools.generate_cfpb_complaint(
        customer_info=CUSTOMER_INFO,
        merchant_info=MERCHANT_INFO,
        transaction_details=TRANSACTION_DETAILS,
        complaint_narrative=COMPLAINT_TEXT
    )
    
    complaints_dir = output_dir / "complaints"
    complaints_dir.mkdir(parents=True, exist_ok=True)
    
    with open(complaints_dir / "cfpb_complaint.json", "w") as f:
        json.dump(cfpb_complaint, f, indent=2)
    print("   ✓ Saved to outputs/complaints/cfpb_complaint.json")
    
    # Generate State AG complaint
    print("3. Creating NJ Attorney General Complaint...")
    ag_complaint = doc_tools.generate_state_ag_complaint(
        state="NJ",
        customer_info=CUSTOMER_INFO,
        merchant_info=MERCHANT_INFO,
        transaction_details=TRANSACTION_DETAILS,
        violations=["NJ Consumer Fraud Act", "TCCWNA"]
    )
    
    with open(complaints_dir / "nj_ag_complaint.txt", "w") as f:
        f.write(ag_complaint)
    print("   ✓ Saved to outputs/complaints/nj_ag_complaint.txt")
    
    # Generate chargeback letter
    print("4. Creating Credit Card Dispute Letter...")
    chargeback_letter = doc_tools.generate_chargeback_letter(
        customer_info=CUSTOMER_INFO,
        card_info={"issuer_name": "Your Credit Card Company"},
        transaction_details=TRANSACTION_DETAILS,
        dispute_reason="Fraudulent transaction - physically impossible"
    )
    
    with open(letters_dir / "chargeback_letter.txt", "w") as f:
        f.write(chargeback_letter)
    print("   ✓ Saved to outputs/letters/chargeback_letter.txt")
    
    # Generate social media posts
    print("5. Creating Social Media Campaign...")
    social_posts = doc_tools.generate_social_media_posts(
        merchant_name="Trivago Deals",
        issue_summary="Charged at midnight for same-day hotel - impossible!"
    )
    
    social_dir = output_dir / "social_media"
    social_dir.mkdir(parents=True, exist_ok=True)
    
    for platform, post in social_posts.items():
        with open(social_dir / f"{platform}_post.txt", "w") as f:
            f.write(post)
    print(f"   ✓ Saved {len(social_posts)} social media posts")
    
    print("\n" + "=" * 80)
    print("✅ DOCUMENT GENERATION COMPLETE!")
    print("=" * 80)
    print()
    print("📁 All documents saved to: /home/delorenj/d/Projects/TrivagoShitbags/outputs/")
    print()
    print("🎯 NEXT STEPS:")
    print("1. Send demand letter to contactus@trivagodeals.com")
    print("2. File CFPB complaint at: https://www.consumerfinance.gov/complaint/")
    print("3. File NJ AG complaint at: https://www.njoag.gov/about/divisions-and-offices/division-of-consumer-affairs-home/file-a-complaint/")
    print("4. Send chargeback letter to your credit card company")
    print("5. Post on social media to apply public pressure")
    print()
    print("💪 Let's get your money back!")

if __name__ == "__main__":
    asyncio.run(main())
