# Dokumentimi i Projektit

## 1. Përshkrimi i Projektit
Ky projekt implementon një sistem rezervimi biletash me ruajtje të dhënash në dy tabela (tabela kryesore dhe rezervë).

---

## 2. Gabimet e trajtuara dhe mënyra e zgjidhjes

### **2.1. Dështimi i tabelës kryesore**
- **Gabimi:** Tabela kryesore mund të bëhet e papërdorshme gjatë operacioneve.
- **Zgjidhja:** 
  - Përmes `try-catch`, të dhënat ruhen automatikisht në tabelën rezervë.

### **2.2. Dështimi i lidhjes me bazën e të dhënave**
- **Gabimi:** Lidhja me MySQL mund të mos funksionojë për shkak të konfigurimit të gabuar.
- **Zgjidhja:** 
  - Sigurohu që skedari `dbConfig` ka kredencialet e sakta.

---

## 3. Testimi
Testet mbulojnë skenarët:
- Ruajtja e të dhënave me të dhëna valide (statusi 201).
- Dështimi i ruajtjes për të dhëna të pavlefshme (statusi 400).
