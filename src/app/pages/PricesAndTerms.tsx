import { useNavigate } from "react-router";
import { Header } from "../components/Header";
import { Check, Info, Shield, CreditCard, FileText, AlertCircle } from "lucide-react";

export function PricesAndTerms() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header variant="simple" title="Priser og Vilkår" onBack={() => navigate(-1)} />

      <div className="max-w-4xl mx-auto px-4 py-8 pb-24">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#111827] mb-4">Priser og Vilkår</h1>
          <p className="text-lg text-[#6B7280] max-w-2xl mx-auto">
            Transparent prising og tydelige vilkår. Ingen skjulte kostnader.
          </p>
        </div>

        {/* Pricing Section */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <CreditCard className="w-6 h-6 text-[#E07B3E]" />
            <h2 className="text-2xl font-bold text-[#111827]">Priser</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* For Customers */}
            <div className="bg-white rounded-lg border-2 border-[#E5E7EB] p-8">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-[#111827] mb-2">For Kunder</h3>
                <div className="text-4xl font-bold text-[#17384E] mb-2">Gratis</div>
                <p className="text-[14px] text-[#6B7280]">Ingen kostnad for å bruke plattformen</p>
              </div>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-[14px] text-[#111827]">Ubegrenset antall forespørsler</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-[14px] text-[#111827]">Motta flere tilbud på hver jobb</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-[14px] text-[#111827]">Tilgang til verifiserte fagfolk</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-[14px] text-[#111827]">Kundeservice og støtte</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-[14px] text-[#111827]">Ingen bindingstid</span>
                </li>
              </ul>

              <div className="p-4 bg-[#F3F4F6] rounded-lg">
                <div className="flex items-start gap-2">
                  <Info className="w-5 h-5 text-[#17384E] flex-shrink-0 mt-0.5" />
                  <p className="text-[13px] text-[#6B7280]">
                    Du betaler kun til håndverkeren for utført arbeid. Ingen formidlingsgebyr.
                  </p>
                </div>
              </div>
            </div>

            {/* For Suppliers */}
            <div className="bg-white rounded-lg border-2 border-[#E07B3E] p-8 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#E07B3E] text-white px-4 py-1 rounded-full text-[13px] font-semibold">
                Populært
              </div>
              
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-[#111827] mb-2">For Fagfolk</h3>
                <div className="flex items-baseline justify-center gap-2 mb-2">
                  <span className="text-4xl font-bold text-[#17384E]">299,-</span>
                  <span className="text-[14px] text-[#6B7280]">per måned</span>
                </div>
                <p className="text-[14px] text-[#6B7280]">Ingen bindingstid</p>
              </div>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-[14px] text-[#111827]">Ubegrenset antall tilbud</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-[14px] text-[#111827]">Egen profilside med portefølje</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-[14px] text-[#111827]">Varsler ved nye jobber i ditt område</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-[14px] text-[#111827]">Verifisert håndverker-merke</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-[14px] text-[#111827]">Prioritert kundeservice</span>
                </li>
              </ul>

              <div className="p-4 bg-[#FEF3E2] rounded-lg border border-[#E07B3E]/20">
                <div className="flex items-start gap-2">
                  <Info className="w-5 h-5 text-[#E07B3E] flex-shrink-0 mt-0.5" />
                  <p className="text-[13px] text-[#6B7280]">
                    Første 14 dager gratis. Ingen oppsigelsesgebyr.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Payment Terms */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <CreditCard className="w-6 h-6 text-[#E07B3E]" />
            <h2 className="text-2xl font-bold text-[#111827]">Betalingsbetingelser</h2>
          </div>

          <div className="bg-white rounded-lg border border-[#E5E7EB] p-8">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-[#111827] mb-2">For fagfolk</h3>
                <ul className="space-y-2 text-[14px] text-[#6B7280]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#E07B3E] mt-1">•</span>
                    <span>Abonnementet belastes månedlig via Vipps eller kort</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#E07B3E] mt-1">•</span>
                    <span>Første betaling gjennomføres etter 14 dagers gratis prøveperiode</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#E07B3E] mt-1">•</span>
                    <span>Abonnementet kan kanselleres når som helst uten oppsigelsesgebyr</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#E07B3E] mt-1">•</span>
                    <span>Ved kansellering har du tilgang ut inneværende betalingsperiode</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-[#111827] mb-2">Betaling mellom kunde og håndverker</h3>
                <ul className="space-y-2 text-[14px] text-[#6B7280]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#E07B3E] mt-1">•</span>
                    <span>Du kan velge å betale til sperret konto (anbefalt) eller avtale direkte betaling</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#E07B3E] mt-1">•</span>
                    <span>Ved bruk av sperret konto er det 2,5% gebyr for å dekke transaksjonskostnader</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#E07B3E] mt-1">•</span>
                    <span>Vi anbefaler skriftlig avtale og dokumentasjon av arbeid</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Escrow Service */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-6 h-6 text-[#E07B3E]" />
            <h2 className="text-2xl font-bold text-[#111827]">Sperret Konto Tjeneste</h2>
          </div>

          <div className="bg-white rounded-lg border border-[#E5E7EB] p-8">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-[#111827] mb-3">Hva er sperret konto?</h3>
                <p className="text-[14px] text-[#6B7280] mb-3">
                  Sperret konto er en sikker betalingsløsning hvor pengene holdes av Håndtverkeren 
                  til kunden godkjenner det utførte arbeidet. Dette gir trygghet for både kunde og fagperson.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-[#111827] mb-3">Slik fungerer det</h3>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-[#E07B3E] rounded-full flex items-center justify-center flex-shrink-0 text-white text-[13px] font-bold">1</div>
                    <div className="flex-1">
                      <p className="text-[14px] text-[#111827] font-medium mb-1">Kunden betaler til sperret konto</p>
                      <p className="text-[13px] text-[#6B7280]">
                        Når tilbud aksepteres, betaler kunden avtalt beløp + 2,5% gebyr til vår sikre sperrede konto
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-[#E07B3E] rounded-full flex items-center justify-center flex-shrink-0 text-white text-[13px] font-bold">2</div>
                    <div className="flex-1">
                      <p className="text-[14px] text-[#111827] font-medium mb-1">Fagpersonen utfører arbeidet</p>
                      <p className="text-[13px] text-[#6B7280]">
                        Fagpersonen får beskjed om at finansiering er bekreftet og kan starte arbeidet trygt
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-[#E07B3E] rounded-full flex items-center justify-center flex-shrink-0 text-white text-[13px] font-bold">3</div>
                    <div className="flex-1">
                      <p className="text-[14px] text-[#111827] font-medium mb-1">Kunden godkjenner arbeidet</p>
                      <p className="text-[13px] text-[#6B7280]">
                        Når jobben er ferdig, har kunden 7 dager til å godkjenne eller klage på arbeidet
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-[#E07B3E] rounded-full flex items-center justify-center flex-shrink-0 text-white text-[13px] font-bold">4</div>
                    <div className="flex-1">
                      <p className="text-[14px] text-[#111827] font-medium mb-1">Pengene utbetales</p>
                      <p className="text-[13px] text-[#6B7280]">
                        Ved godkjenning utbetales pengene til fagpersonen innen 1-2 virkedager
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-[#111827] mb-3">Gebyr og vilkår</h3>
                <ul className="space-y-2 text-[14px] text-[#6B7280]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#E07B3E] mt-1">•</span>
                    <span>Gebyr på 2,5% av totalt beløp (betales av kunde)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#E07B3E] mt-1">•</span>
                    <span>Kunden har 7 dager etter fullført arbeid til å godkjenne eller klage</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#E07B3E] mt-1">•</span>
                    <span>Hvis ingen handling tas innen 7 dager, godkjennes arbeidet automatisk</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#E07B3E] mt-1">•</span>
                    <span>Ved tvister holdes pengene til saken er løst gjennom vår tvisteløsning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#E07B3E] mt-1">•</span>
                    <span>Pengene er beskyttet og holdes på egen konto hos norsk bank</span>
                  </li>
                </ul>
              </div>

              <div className="bg-[#F0FDF4] border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-green-900 mb-1">100% Trygghet</h4>
                    <p className="text-[13px] text-green-700">
                      Pengene er sikret i henhold til norsk lov og våre sikkerhetsprosedyrer. 
                      Ved konkurs eller andre problemer er kundenes penger beskyttet.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Terms and Conditions */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-6 h-6 text-[#E07B3E]" />
            <h2 className="text-2xl font-bold text-[#111827]">Bruksvilkår</h2>
          </div>

          <div className="bg-white rounded-lg border border-[#E5E7EB] p-8">
            <div className="space-y-6 text-[14px] text-[#6B7280]">
              <div>
                <h3 className="font-semibold text-[#111827] mb-3">1. Generelt</h3>
                <p className="mb-2">
                  Håndtverkeren er en digital plattform som kobler kunder med verifiserte fagfolk. 
                  Ved å bruke tjenesten aksepterer du disse vilkårene.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-[#111827] mb-3">2. Brukerens ansvar</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-[#E07B3E] mt-1">•</span>
                    <span>Du må være minimum 18 år for å bruke tjenesten</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#E07B3E] mt-1">•</span>
                    <span>All informasjon du oppgir skal være korrekt og oppdatert</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#E07B3E] mt-1">•</span>
                    <span>Du er ansvarlig for å holde påloggingsinformasjon konfidensiell</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#E07B3E] mt-1">•</span>
                    <span>Misbruk av plattformen kan føre til suspensjon av konto</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-[#111827] mb-3">3. Fagfolks forpliktelser</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-[#E07B3E] mt-1">•</span>
                    <span>Fagfolk må ha gyldig autorisasjon der dette er påkrevd</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#E07B3E] mt-1">•</span>
                    <span>Fagfolk må ha gyldig ansvars- og yrkesskadeforsikring</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#E07B3E] mt-1">•</span>
                    <span>Tilbud skal være realistiske og bindende</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#E07B3E] mt-1">•</span>
                    <span>Arbeid skal utføres profesjonelt og i henhold til avtale</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-[#111827] mb-3">4. Ansvarsfraskrivelse</h3>
                <p className="mb-2">
                  Håndtverkeren er en formidlingsplattform og står ikke ansvarlig for:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-[#E07B3E] mt-1">•</span>
                    <span>Kvaliteten på utført arbeid</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#E07B3E] mt-1">•</span>
                    <span>Tvister mellom kunde og fagperson</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#E07B3E] mt-1">•</span>
                    <span>Skader eller mangler ved utført arbeid</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#E07B3E] mt-1">•</span>
                    <span>Betalingstvister eller økonomisk tap</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-[#111827] mb-3">5. Personvern</h3>
                <p className="mb-2">
                  Vi behandler personopplysninger i henhold til GDPR. Les vår personvernerklæring 
                  for mer informasjon om hvordan vi samler inn og bruker data.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-[#111827] mb-3">6. Endringer i vilkår</h3>
                <p>
                  Håndtverkeren forbeholder seg retten til å endre vilkårene med 30 dagers varsel. 
                  Endringer vil bli kommunisert via e-post og på plattformen.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Guarantees */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-6 h-6 text-[#E07B3E]" />
            <h2 className="text-2xl font-bold text-[#111827]">Våre Garantier</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
              <div className="w-12 h-12 bg-[#17384E]/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-[#17384E]" />
              </div>
              <h3 className="font-semibold text-[#111827] mb-2">Verifiserte Fagfolk</h3>
              <p className="text-[14px] text-[#6B7280]">
                Alle fagfolk er ID-sjekket og har dokumentert kompetanse og nødvendige forsikringer.
              </p>
            </div>

            <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
              <div className="w-12 h-12 bg-[#E07B3E]/10 rounded-lg flex items-center justify-center mb-4">
                <Check className="w-6 h-6 text-[#E07B3E]" />
              </div>
              <h3 className="font-semibold text-[#111827] mb-2">Kvalitetssikring</h3>
              <p className="text-[14px] text-[#6B7280]">
                Vi følger opp alle jobber og fjerner fagfolk med dårlige anmeldelser fra plattformen.
              </p>
            </div>

            <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
              <div className="w-12 h-12 bg-[#17384E]/10 rounded-lg flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6 text-[#17384E]" />
              </div>
              <h3 className="font-semibold text-[#111827] mb-2">Kundestøtte</h3>
              <p className="text-[14px] text-[#6B7280]">
                Vårt supportteam er tilgjengelig for å hjelpe ved spørsmål eller problemer.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section>
          <div className="bg-[#17384E] rounded-lg p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-3">Har du spørsmål?</h2>
            <p className="text-[14px] mb-6 opacity-90">
              Kontakt oss på <a href="mailto:hei@håndtverkeren.no" className="underline">hei@håndtverkeren.no</a> eller ring oss på 
              <a href="tel:+4712345678" className="underline ml-1">123 45 678</a>
            </p>
            <button
              onClick={() => navigate("/registrering")}
              className="h-12 px-8 bg-[#E07B3E] text-white rounded-lg font-semibold hover:bg-[#d16f35] transition-colors"
            >
              Kom i gang nå
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}