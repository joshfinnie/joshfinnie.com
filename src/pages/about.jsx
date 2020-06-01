/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';

import Layout from '../components/Layout';
import resume from '../assets/docs/finnie-resume.pdf';
import SEO from '../components/SEO';

const AboutPage = () => (
  <Layout>
    <SEO title="About" />
    <div className="main-div">
      <h1 className="text-center">About</h1>
      <p>
        I am an Senior Software Engineer at <a href="https://pbs.org/">PBS</a>{' '}
        where I can be found coding in Python and Javascript.
      </p>
      <h2>Projects</h2>
      <ul>
        <li>
          <a
            href="https://www.beerledge.com/ledges/"
            target="_blank"
            rel="noopener noreferrer">
            BeerLedge
          </a>
        </li>
        <li>
          <a
            href="https://www.npmjs.org/package/pushfile"
            target="_blank"
            rel="noopener noreferrer">
            Pushfile
          </a>
        </li>
        <li>
          <a
            href="http://www.howoldisthismetrocar.com"
            target="_blank"
            rel="noopener noreferrer">
            How Old is this Metro Car?
          </a>
        </li>
        <li>Tweet PNG (Currently not working...)</li>
      </ul>
      <p>
        <a
          href="https://github.com/joshfinnie?tab=repositories"
          target="_blank"
          rel="noopener noreferrer">
          Other open-source projects found on Github.
        </a>
      </p>
      <h2>Resume</h2>
      <p className="no-js">
        <strong>Experience:</strong> Senior Software Engineer &#8211; PBS |
        Senior Software Maven (Promoted from Software Maven) &#8211; TrackMaven
        by Skyword | Application Developer &#8211; Koansys, LLC.
      </p>
      <p className="no-js">
        <strong>Languages:</strong> Javascript (Node, Angular, React, jQuery),
        Python (Django, Flask, Pyramid)
      </p>
      <p className="no-js">
        <strong>Databases:</strong> PostgreSQL, MongoDB, MySQL
      </p>
      <p className="no-js">
        <strong>SCM:</strong> GIT
      </p>
      <p className="no-js">
        <strong>Education:</strong> Classes towards a MS in Geography &#8211;
        Central Connecticut State University | BA in Economics &amp; Minor in
        Mathematics &#8211; University of Connecticut
      </p>
      <p className="no-js">
        <strong>Other Interests:</strong> Coffee, Cycling, Photography, Amateur
        Radio (
        <a
          href="http://www.qrz.com/db/W1OFZ"
          target="_blank"
          rel="noopener noreferrer">
          W1OFZ
        </a>
        )
      </p>
      <p className="text-center">
        <a href={resume}>Download full resume (PDF)</a>.
      </p>
      <h2>PGP Public Key</h2>
      <div className="gatsby-highlight" data-language="bash">
        <pre className="language-bash">
          <code className="language-bash">
            -----BEGIN PGP PUBLIC KEY BLOCK-----
            <br />
            Version: Keybase OpenPGP JS 0.0.1
            <br />
            Comment: https://keybase.io/crypto
            <br />
            <br />
            xsFNBFMwgqkBEACuUgsAfqN1Sc+bbW5QE3A+reSm9dqdA8TfSAKOFWeoiHwYaOWV
            <br />
            oTpI2u/nr9vlJ4zQQRgZ1kTgaPUe7BRtIQP7A+vdL4GDZc/1KpYUOXTP8yt+Mf5T
            <br />
            reUYiqdwRvPDAAHkBulJ/yxeRkmntAu1XLLxaXx+mujU448acuq0Suapd1AY6iXB
            <br />
            /k9aYmkAIoW+bavAx5ceFTGhfN7bpsdSk5evnFDuoXUnbrdkzGs+oPDAp+MuZpRU
            <br />
            GyH2Tou+Ne9hzbpcWiKwra7bHx+9QMjZfA8SU+V9x8tQjEgSKmk42dpW2/+h7eyN
            <br />
            05g+EYa5uOJAd+4w6WIO3yP7wqa5mHL4zlVWL/rGxEw+OR6DYfiRsV6dJWhgQ9CD
            <br />
            n39gGC44eXbGkgeFqeWB44nexTRL0bmXWMGxuPR1gNtPzD0FpOniwn/wLZJ7Pbnq
            <br />
            7I6rypexJXRnVUT1cqhoT0jS6nynIOhDuJcSrgVEll/Bx7iv6a9s8r5fPv9VsOlk
            <br />
            hLX0fowj+0cIg3Pqr/h6lnrILiqs8jNEpRpObWyt4OkK+Nhd+s4wCDLg+ct/ddRG
            <br />
            r71szxP5Am2BmSnb/WonRJ7vtmlb//Lz+pjUReaGdPyBtGSLJdFy3YhhMDm6kmuS
            <br />
            Y1J3kL8k0na+qVBdBSWexwpgSsrDHtGnZoyknGwNhMDgZl5EUvFVpouYMwARAQAB
            <br />
            zS1rZXliYXNlLmlvL2pvc2hmaW5uaWUgPGpvc2hmaW5uaWVAa2V5YmFzZS5pbz7C
            <br />
            wW0EEwEKABcFAlMwgqkCGy8DCwkHAxUKCAIeAQIXgAAKCRAJ3qg6WVwk5vHAD/9y
            <br />
            0ZyjpataOP4XMJQRQEdU8TsJJGVXA4ibPMtY0a/iQ3Hhs/6CFxIw6CVDTiIVpPNM
            <br />
            v50RA6t/r6kNMmoN4eQWdK3RQ3moIgr+vm3PrY4KW8R9buuBTovW/gVuPkN5o0G6
            <br />
            k/x4Uu1RiiFDHPU6fkHPKuzm3oZOvJmasR0YwSjbIgnND0NmSrauBMLGfmDtOfWH
            <br />
            xAr/z8ytR0WigecF6k78D+ECnfanr9VltZ7b22MLXaJnMiCZnNpMySvOuPyteX5m
            <br />
            JLvNSQWsFKQ4q2fQv/8zpGgvtqJAgjQ3qXeToZYMwc3UXX3TxOmJHDJULKEtuw0q
            <br />
            gc01StMkEKnEYM3IsNJAa4d/OR94SCyHOtLlqyuFaX7SticvAC3YxyznWZspZbwe
            <br />
            erEAP5rf0AFbcF65FNH1c7eItg72hv9v8rc6oAvAzcwesagvrOsE9/7uH8gKkMVe
            <br />
            5QQ9Pq9vwCtzZYi05lzRrWF5Hry1Oud9T9SDGj7nRxZ/vKfzAu2kTms2wv6J1oK2
            <br />
            mzhfUmQmR7qTMCs2DCQ+o8PiUE1Aj3x2xgGycZhTl11doKyxRCElvwJJAoDD0Cpr
            <br />
            usX51JUdlGi5POxV3cfNvFdZJoQJNYNX/9IUnFm5lfSAMNjuIU7n51maEWfGIBvb
            <br />
            qeTrj6cJTHFIdVsv7cKdiGj2RQQJ5FJR2xjJL/r+Rc7ATQRTMIKpAQgArPwJsRF2
            <br />
            hQ+q21HgN9dtDCOwUBJvM55PxcTfieKSn7HB8EgOQz+qce8oNM2MBlreAqXNDxsS
            <br />
            6M0P4nOSzUXmszZFvyN7yMTSr3zcyb/vNFjZdRIMLuf/llQjDD32QxzLtZMXE9y7
            <br />
            iMkCvX2EHa9lDU/aE+igdg0i0bI5fAaXmEzNrkNGwIarxmzJ+XHLtAla566Q12zB
            <br />
            8XGCMAAQfoj+7KswZy2b5iiVjERC8/CJzP8tzTRg42XSvbqWRHFWB3kal5f78qfv
            <br />
            /TnugohQKli3bN479nG6YA+yFe5wRLRUKBIfUEvzrTWIk1RYiSaUm0YhcMCZDlU/
            <br />
            3BVHkUInI0engQARAQABwsKEBBgBCgAPBQJTMIKpBQkPCZwAAhsuASkJEAneqDpZ
            <br />
            XCTmwF0gBBkBCgAGBQJTMIKpAAoJEH4mfyqonrkMWM0IAJxrBfCnZyb29fqBTcOQ
            <br />
            VBzRow/IzJvFhDDrkCAnwTOxYFpvRnyXt1Q1YsySLA+C+zDOgXeOO6N85YblAAII
            <br />
            Fnea9qDjzynjbOfcPVT6bwHXLuyMk73+n9vsVeWsmAOuz5fJxWuxrOPSeWTfL4uK
            <br />
            uoWdmwt9uWrWGs7t2/ABW+4nduD5DVU8p5603yIsYFuWi+Z1DGkBBucDSv9e/xMW
            <br />
            daScm3rZnEZP4Cqa+YWIc04zKDpiMutCSnXgvM8iUghHIAnH54hxrZL2VQ3VYDt5
            <br />
            H2ehhEBDrjScW33SKBivLoGR7aqdYWGhPNGoxW8PNs/1NUBBp/Lp294s7DDZvWbm
            <br />
            zyf80A/8DAg9cqI8ahP6ueP6HSofLzJkmSXTUgpbt2cHkzhh3ehWfyF/wZ028DTy
            <br />
            VdAyZXtAm02iVlq+4mUvcOwxmSaxaWUAIG3mGMlqzYnSYe+DF1retMA8KR3rkoZO
            <br />
            mu//iRbDWOf7OzuhN3AiWQv+BZpgeRewu7RDdfbzrRGEDCrk86poS1PBGA1VZrVI
            <br />
            ejfE890k33FtiHTO9b3Mhq4GSr/ltWuFPoUnFvWQl+geAaJ9qnO85BJ84w4abON5
            <br />
            mxxr2U/Zf7ii6zKytoGdz3BoBVhE826b6v2Yo5YxUjZb/rrYM4LBPTz8ff1kAzwC
            <br />
            UCJXeFWSMiNGwCIZn7F1dBj5OeMGlsq7mw845iw69UN3gd/7eMOP6/d+A2cpgstM
            <br />
            FPlU9KiVYPHpUC18rM+xTez+FitmNny3+/5pEiyqwunlnqAs3YWNF284uirEs56J
            <br />
            msYQBL0CpEKuh83t8sXATsi3KE6/5esuznEKyw535ZVpKhAQQQdipH9vayITmT7v
            <br />
            a9qDgup4in/KYWyc+P9gRAA8hECt9XPIPgrt4vns9ZJ1rkbE6BbZ7NQiED5KZkxC
            <br />
            mr4ZH0bUbUH1iF36YL/M+VZDXEDkqbNOTyqwRD5vaiDhUnfsgIMoRDy1h0MTBwA6
            <br />
            6XY49QcC1GaIt+HxvzLabEYRP4QqcOUYHscFoaPCLtSmaV0Eu3k=
            <br />
            =PElW
            <br />
            -----END PGP PUBLIC KEY BLOCK-----
            <br />
          </code>
        </pre>
      </div>
      <p>
        <a
          href="//keybase.io/joshfinnie/key.asc"
          target="_blank"
          rel="noopener noreferrer">
          Raw version
        </a>
      </p>
    </div>
  </Layout>
);

export default AboutPage;
