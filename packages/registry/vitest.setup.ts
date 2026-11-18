import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Testing Library only auto-cleans when vitest globals are enabled; we keep globals off.
afterEach(cleanup);
