<script>
    let username = ""
    let password = ""
    let timestamp = ""
    let message = "aaaa"
    let messageColor = ""

 async function feinarLogin(usr, pwd) {
    const url = "https://portale-dipendenti-api.feinar.it/api/v1/Auth/web/login";

    const headers = {
        "Host": "portale-dipendenti-api.feinar.it",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:144.0) Gecko/20100101 Firefox/144.0",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "it-IT,it;q=0.8,en-US;q=0.5,en;q=0.3",
        "Content-Type": "application/json",
        "Origin": "https://hr.feinar.it",
        "Referer": "https://hr.feinar.it/",
    };

    const body = {
        nomeUtente: usr,
        password: pwd
    };

    const res = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body)
    });

    if (!res.ok) {
        console.log(`Login request failed (${res.status})`);
    }

    const data = await res.json();
    console.log(data.jwtToken)
    return data.jwtToken;
}

async function timbra(modalita, token, tmp,  test = true) {
    message = ""
    const headers = {
        "Accept": "application/json, text/plain, */*",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "Origin": "https://hr.feinar.it",
        "Referer": "https://hr.feinar.it/",
        "User-Agent": "Mozilla/5.0"   // potrebbe venire ignorata dal browser
    };

    const payload = {
        colore: "#B03A2E",
        dataOra: tmp,
        suffisso: "",
        tipo: "T",
        verso: modalita
    };

    console.log("Payload:", payload);

    if (test) {
        console.log("[TEST MODE] Nessuna richiesta inviata.");
        return payload;
    }
    
    // const url = "https://portale-dipendenti-api.feinar.it/api/v1/Presenze/web/timbra";
    const url = ""

    const resp = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(payload)
    });

    console.log("Status:", resp.status);

    try {
        const data = await resp.json();
        console.log("Response JSON:", data);
        messageColor=" text-green-500"
        message="Timbratura effettuata con successo"
        return data;
    } catch {
        const txt = await resp.text();
        console.log("Response text:", txt);
        messageColor=" text-red-500"
        message=txt
        return txt;
    } 
}

    async function entra(){
        let token = await feinarLogin(username, password)
        console.log(token)
        let payload = timbra("E", token, timestamp, false)
        console.log(payload)
    }

    async function esci(){
        let token = await feinarLogin(username, password)
        console.log(token)
        let payload = timbra("U", token, timestamp, false)
        console.log(payload)

    }

    function test() {
        
    }
</script>

<div class="min-h-screen w-full flex justify-center items-center">
  <div class="flex flex-col items-center gap-6">

    <h1 class="font-semibold text-4xl font-sans text-center">
      Grazie Feinar.
    </h1>

    <div name="login" class="flex flex-col gap-4 w-full max-w-xs">

      <label class="input validator w-full">
        <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <g stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" fill="none" stroke="currentColor">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </g>
        </svg>
        <input
          type="text"
          required
          placeholder="Username"
          pattern="[A-Za-z][A-Za-z0-9\-]*"
          minlength="3"
          maxlength="30"
          title="Only letters, numbers or dash"
          bind:value={username}
        />
      </label>
      <label class="input validator w-full">
        <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <g stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" fill="none" stroke="currentColor">
            <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
            <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
          </g>
        </svg>
        <input type="password" required placeholder="Password" bind:value={password}/>
      </label>

      <input type="datetime-local" class="input w-full" bind:value={timestamp}/>
      <div class="flex flex-row justify-between">
        <button class="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl" on:click={entra}>Entra</button>
        <button class="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl" on:click={esci}>Esci</button>
      </div>
      <p class="font-bold {messageColor}">{message}</p>
    </div>
  </div>
</div>
